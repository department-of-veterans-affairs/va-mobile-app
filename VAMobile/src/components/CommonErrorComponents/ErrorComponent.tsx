import React, { FC } from 'react'

import { CallHelpCenter, NetworkConnectionError } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ErrorsState, StoreState } from 'store'
import { TFunction } from 'i18next'
import { useSelector } from 'react-redux'

export type ErrorComponentProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
  t?: TFunction
}

const ErrorComponent: FC<ErrorComponentProps> = (props) => {
  const { errorType, tryAgain: storeTryAgain } = useSelector<StoreState, ErrorsState>((s) => s.errors)

  const getSpecificErrorComponent: FC<ErrorComponentProps> = ({ onTryAgain, t }) => {
    const tryAgain = onTryAgain ? onTryAgain : storeTryAgain

    // check which specific error occurred and return the corresponding error element
    switch (errorType) {
      case CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR:
        return <NetworkConnectionError onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR:
        return <CallHelpCenter />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_WITH_REFRESH:
        return <CallHelpCenter onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_LOAD_MESSAGES:
        return (
          <CallHelpCenter
            onTryAgain={tryAgain}
            errorText={t ? t('secureMessaging.sendError.ifTheAppStill') : undefined}
            errorA11y={t ? t('secureMessaging.sendError.ifTheAppStill.a11y') : undefined}
            callPhone={t ? t('secureMessaging.attachments.FAQ.ifYourProblem.phone') : undefined}
          />
        )
      default:
        return <CallHelpCenter onTryAgain={tryAgain} />
    }
  }

  return getSpecificErrorComponent(props)
}

export default ErrorComponent
