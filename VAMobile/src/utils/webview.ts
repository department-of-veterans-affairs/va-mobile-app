import { TFunction } from 'i18next'

import getEnv from 'utils/env'

export const vaGovWebviewTitle = (t: TFunction) => {
  const { ENVIRONMENT } = getEnv()
  if (ENVIRONMENT === 'staging' || ENVIRONMENT === 'local') {
    return t('webview.staging.vagov')
  }

  return t('webview.vagov')
}
