import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityInfo } from 'react-native'
import { useSelector } from 'react-redux'

import NetInfo, { addEventListener, useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { onlineManager } from '@tanstack/react-query'
import { DateTime } from 'luxon'

import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { CONNECTION_STATUS } from 'constants/offline'
import { RootState } from 'store'
import {
  OfflineState,
  logOfflineEventQueue,
  queueOfflineScreenEvent,
  setBannerExpanded,
  setOfflineTimestamp,
  setShouldAnnounceOffline,
} from 'store/slices'
import { useAppDispatch } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Tracks the use of a screen while in offline mode. When the provided screen is focused for the first time while
 * offline an event will be queued in the store to be logged once the device comes back online.
 * @param screen - ID of the screen tracked for offline usage
 */
export const useOfflineEventQueue = (screen: string) => {
  const dispatch = useAppDispatch()
  const { forceOffline } = useSelector<RootState, OfflineState>((state) => state.offline)

  useFocusEffect(
    useCallback(() => {
      if (!featureEnabled('offlineMode')) {
        return
      }

      const unsubscribe = addEventListener(({ isConnected }) => {
        const connected = forceOffline || isConnected
        // Upon navigating to a screen while offline queue an event
        if (connected === false) {
          dispatch(queueOfflineScreenEvent(Events.vama_offline_access(screen)))
        }
      })

      return () => {
        unsubscribe()
      }
    }, [dispatch, forceOffline, screen]),
  )
}

/**
 * Returns a value representing whether the app is able to connect to the internet. If
 * offline mode is disabled this will always return true
 */
export function useAppIsOnline(): string {
  const { isConnected } = useNetInfo()
  const { forceOffline } = useSelector<RootState, OfflineState>((state) => state.offline)

  if (!featureEnabled('offlineMode')) {
    return CONNECTION_STATUS.CONNECTED
  }

  if (forceOffline) {
    return CONNECTION_STATUS.DISCONNECTED
  }

  if (isConnected === null) {
    return CONNECTION_STATUS.UNKNOWN
  }

  return isConnected ? CONNECTION_STATUS.CONNECTED : CONNECTION_STATUS.DISCONNECTED
}

/**
 * Enables the listeners for react query to listen for any network status changes from net info.
 */
export const useNetworkConnectionListener = () => {
  const forceOffline = useSelector<RootState>((state) => state.offline.forceOffline)
  const remoteConfigActivated = useSelector<RootState>((state) => state.settings.remoteConfigActivated)
  useEffect(() => {
    if (remoteConfigActivated && featureEnabled('offlineMode')) {
      // Using rnc net info create event listener for network connection status
      onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
          setOnline(forceOffline ? false : !!state.isConnected)
        })
      })
    }
  }, [remoteConfigActivated, forceOffline])
}

/**
 * Used to announce the connection and disconnection status while a screen reader is enabled.
 */
export const useOfflineAnnounce = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const connectionStatus = useAppIsOnline()
  const { offlineTimestamp } = useSelector<RootState, OfflineState>((state) => state.offline)
  const remoteConfigActivated = useSelector<RootState>((state) => state.settings.remoteConfigActivated)

  // Update timestamp when connection status changes
  useEffect(() => {
    if (remoteConfigActivated && featureEnabled('offlineMode')) {
      if (connectionStatus === CONNECTION_STATUS.DISCONNECTED && !offlineTimestamp) {
        dispatch(setOfflineTimestamp(DateTime.local()))
        dispatch(setShouldAnnounceOffline(true))
        AccessibilityInfo.announceForAccessibilityWithOptions(t('offline.banner.title'), { queue: true })
      } else if (connectionStatus === CONNECTION_STATUS.CONNECTED && offlineTimestamp) {
        dispatch(setOfflineTimestamp(undefined))
        dispatch(setShouldAnnounceOffline(false))
        dispatch(setBannerExpanded(false))
        AccessibilityInfo.announceForAccessibilityWithOptions(t('offline.connectedToTheInternet'), { queue: true })
      }
    }
  }, [connectionStatus, offlineTimestamp, dispatch, t, remoteConfigActivated])
}

export const useOfflineNavEvents = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const connectionStatus = useAppIsOnline()

  // Starts a listener to queue analytics events when navigating between screens.
  useEffect(() => {
    const cb = () => {
      if (featureEnabled('offlineMode') && connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
        // @ts-ignore - getCurrentRoute does not appear on the type but does exist
        dispatch(queueOfflineScreenEvent(Events.vama_offline_access(navigation.getCurrentRoute().name)))
      }
    }
    navigation.addListener('state', cb)
    return () => navigation.removeListener('state', cb)
  }, [connectionStatus, dispatch, navigation])

  // Listens to the connection status and triggers
  useEffect(() => {
    if (!featureEnabled('offlineMode')) {
      return
    }

    let isOnline: boolean | null = null
    const unsubscribe = addEventListener(({ isConnected }) => {
      const connected = isConnected
      // When the connection status changes update for later
      if (connected !== isOnline) {
        // Once connection has been reestablished log the offline events in the queue
        if (connected) {
          dispatch(logOfflineEventQueue())
        }
        isOnline = connected
      }
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch])
}
