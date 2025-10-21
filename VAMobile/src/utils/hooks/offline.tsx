import { useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'

import NetInfo, { addEventListener, useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native'

import { onlineManager } from '@tanstack/react-query'
import { TFunction } from 'i18next'

import { Events } from 'constants/analytics'
import { RootState } from 'store'
import { OfflineState, logOfflineEventQueue, queueOfflineEvent } from 'store/slices'
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

/**
 * Returns a value representing whether the app is able to connect to the internet. If
 * offline mode is disabled this will always return true
 */
export function useAppIsOnline(): boolean {
  const { isConnected } = useNetInfo()
  const { forceOffline } = useSelector<RootState, OfflineState>((state) => state.offline)

  if (!featureEnabled('offlineMode')) {
    return true
  }

  if (forceOffline) {
    return false
  }

  return !!isConnected
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

// Enabling any to handle the type of the snackbar which is not exposed in the component library
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showOfflineSnackbar(snackbar: any, t: TFunction, inModal = false): void {
  if (inModal) {
    // TODO: CONFIRM CONTENT
    Alert.alert('TEMP TITLE', t('offline.toast.checkConnection'), [{ text: t('dismiss'), style: 'default' }])
  } else {
    snackbar.show(t('offline.toast.checkConnection'), { isError: true })
  }
}

export function useIsWithinModal(): boolean {
  const { viewingModal } = useSelector<RootState, OfflineState>((state) => state.offline)
  return !!viewingModal
}
