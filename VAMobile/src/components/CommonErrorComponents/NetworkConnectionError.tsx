import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import BasicError from './BasicError'

export type NetworkConnectionErrorProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
}

const NetworkConnectionError: FC<NetworkConnectionErrorProps> = ({ onTryAgain }) => {
  const t = useTranslation(NAMESPACE.COMMON)

  return (
    <BasicError
      onTryAgain={onTryAgain}
      messageText={t('errors.networkConnection.body')}
      buttonA11yHint={t('errors.networkConnection.a11yHint')}
      headerText={t('errors.networkConnection.header')}
      headerA11yLabel={t('errors.networkConnection.headerA11yLabel')}
      label={t('refresh')}
    />
  )
}

export default NetworkConnectionError
