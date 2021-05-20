import React, { FC } from 'react'

import { CallHelpCenter, NetworkConnectionError } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ErrorsState, StoreState } from 'store'
import { useSelector } from 'react-redux'
import { useTranslation } from 'utils/hooks'

export type ErrorComponentProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
}

const ErrorComponent: FC<ErrorComponentProps> = (props) => {
  const { errorType, tryAgain: storeTryAgain } = useSelector<StoreState, ErrorsState>((s) => s.errors)
  const t = useTranslation()

  const getSpecificErrorComponent: FC<ErrorComponentProps> = ({ onTryAgain }) => {
    const tryAgain = onTryAgain ? onTryAgain : storeTryAgain

    // check which specific error occurred and return the corresponding error element
    switch (errorType) {
      case CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR:
        return <NetworkConnectionError onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR:
        return <CallHelpCenter />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_WITH_REFRESH:
        return <CallHelpCenter onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD:
        return (
          <CallHelpCenter
            onTryAgain={tryAgain}
            errorText={t('health:secureMessaging.sendError.ifTheAppStill')}
            errorA11y={t('health:secureMessaging.sendError.ifTheAppStill.a11y')}
            callPhone={t('health:secureMessaging.attachments.FAQ.ifYourProblem.phone')}
          />
        )
      default:
        return <CallHelpCenter onTryAgain={tryAgain} />
    }
  }

  return getSpecificErrorComponent(props)
}

export default ErrorComponent
