import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityInfo, Alert } from 'react-native'
import { useSelector } from 'react-redux'

import NetInfo, { addEventListener, useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native'

import { onlineManager } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import {
  OfflineState,
  logOfflineEventQueue,
  queueOfflineEvent,
  setBannerExpanded,
  setOfflineTimestamp,
  setShouldAnnounceOffline,
} from 'store/slices'
import { useAppDispatch } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

export const useOfflineEventQueue = (screen: string) => {
  const dispatch = useAppDispatch()
  const { forceOffline } = useSelector<RootState, OfflineState>((state) => state.offline)

  useFocusEffect(
    useCallback(() => {
      if (!featureEnabled('offlineMode')) {
        return
      }

      let isOnline: boolean | null = null
      const unsubscribe = addEventListener(({ isConnected }) => {
        const connected = forceOffline || isConnected
        // Upon navigating to a screen while offline queue an event
        if (connected === false) {
          dispatch(queueOfflineEvent(Events.vama_offline_access(screen)))
        }

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
    }, [dispatch, forceOffline, screen]),
  )
}

export const CONNECTION_STATUS = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  UNKNOWN: 'UNKNOWN',
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

export const useOfflineAnnounce = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const connectionStatus = useAppIsOnline()
  const { offlineTimestamp } = useSelector<RootState, OfflineState>((state) => state.offline)

  // Update timestamp when connection status changes
  useEffect(() => {
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
  }, [connectionStatus, offlineTimestamp, dispatch, t])
}

// Enabling any to handle the type of the snackbar which is not exposed in the component library
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showOfflineSnackbar(snackbar: any, t: TFunction, inModal = false): void {
  if (inModal) {
    Alert.alert(t('offline.alert.title'), t('offline.alert.body'), [{ text: t('dismiss'), style: 'default' }])
  } else {
    snackbar.show(t('offline.toast.checkConnection'), { isError: true })
  }
}

export function useIsWithinModal(): boolean {
  const { viewingModal } = useSelector<RootState, OfflineState>((state) => state.offline)
  return !!viewingModal
}
