import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import BasicError from './BasicError'

export type NetworkConnectionErrorProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
}

/**A common component to show an alert for when it is a network error*/
const NetworkConnectionError: FC<NetworkConnectionErrorProps> = ({ onTryAgain }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <BasicError
      onTryAgain={onTryAgain}
      messageText={t('errors.networkConnection.body')}
      buttonA11yHint={t('errors.networkConnection.a11yHint')}
      headerText={t('errors.networkConnection.header')}
      label={t('refresh')}
    />
  )
}

export default NetworkConnectionError
