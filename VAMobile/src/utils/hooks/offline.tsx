import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'

import { useNetInfo } from '@react-native-community/netinfo'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { TFunction } from 'i18next'

import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { OfflineState } from 'store/slices'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Returns a value representing whether the app is able to connect to the internet. If
 * offline mode is disabled this will always return true
 */
export function useOfflineMode(): boolean {
  const { isConnected } = useNetInfo()

  // if (!featureEnabled('offlineMode')) {
  //   return true
  // }

  return !!isConnected
}

// Enabling any to handle the type of the snackbar which is not exposed in the component library
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showOfflineSnackbar(snackbar: any, t: TFunction, inModal = false): void {
  if (inModal) {
    // TODO: CONFIRM CONTENT
    Alert.alert('Content unavailable', t('offline.toast.checkConnection'), [{ text: t('dismiss'), style: 'default' }])
  } else {
    snackbar.show(t('offline.toast.checkConnection'), { isError: true })
  }
}

export function useIsWithinModal(): boolean {
  const { viewingModal } = useSelector<RootState, OfflineState>((state) => state.offline)
  return !!viewingModal
}

export function useShowOfflineSnackbarIfNeeded(): boolean {
  const isConnected = useOfflineMode()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const snackbar = useSnackbar()

  if (isConnected) {
    return false
  } else {
    showOfflineSnackbar(snackbar, t)
    return true
  }
}
