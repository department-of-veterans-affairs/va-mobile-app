import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'

import { addEventListener, useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native'

import { TFunction } from 'i18next'

import { Events } from 'constants/analytics'
import { RootState } from 'store'
import { OfflineState, logOfflineEventQueue, queueOfflineEvent } from 'store/slices'
import { useAppDispatch } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

export const useOfflineEventQueue = (screen: string) => {
  const dispatch = useAppDispatch()

  useFocusEffect(
    useCallback(() => {
      if (!featureEnabled('offlineMode')) {
        return
      }

      let isOnline: boolean | null = null
      const unsubscribe = addEventListener(({ isConnected }) => {
        // Upon navigating to a screen while offline queue an event
        if (isConnected === false) {
          dispatch(queueOfflineEvent(Events.vama_offline_access(screen)))
        }

        // When the connection status changes update for later
        if (isConnected !== isOnline) {
          // Once connection has been reestablished log the offline events in the queue
          if (isConnected) {
            dispatch(logOfflineEventQueue())
          }
          isOnline = isConnected
        }
      })

      return () => {
        unsubscribe()
      }
    }, [dispatch, screen]),
  )
}

/**
 * Returns a value representing whether the app is able to connect to the internet. If
 * offline mode is disabled this will always return true
 */
export function useAppIsOnline(): boolean {
  const { isConnected } = useNetInfo()

  if (!featureEnabled('offlineMode')) {
    return true
  }

  return !!isConnected
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
