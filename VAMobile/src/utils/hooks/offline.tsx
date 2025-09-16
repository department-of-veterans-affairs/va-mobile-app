import { useTranslation } from 'react-i18next'

import { useNetInfo } from '@react-native-community/netinfo'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { TFunction } from 'i18next'

import { NAMESPACE } from 'constants/namespaces'

export function useOfflineMode(): boolean {
  const { isConnected } = useNetInfo()
  return !!isConnected
}

// Enabling any to handle the type of the snackbar which is not exposed in the component library
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showOfflineSnackbar(snackbar: any, t: TFunction): void {
  snackbar.show(t('offline.toast.checkConnection'), { isError: true })
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
