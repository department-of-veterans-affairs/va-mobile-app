import React, { FC } from 'react'

import { CallHelpCenter, NetworkConnectionError } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ErrorsState, StoreState } from 'store'
import { useSelector } from 'react-redux'

export type ErrorComponentProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
}

const ErrorComponent: FC<ErrorComponentProps> = (props) => {
  const { errorType, tryAgain: storeTryAgain } = useSelector<StoreState, ErrorsState>((s) => s.errors)

  const getSpecificErrorComponent: FC<ErrorComponentProps> = ({ onTryAgain }) => {
    const tryAgain = onTryAgain ? onTryAgain : storeTryAgain

    // check which specific error occurred and return the corresponding error element
    switch (errorType) {
      case CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR:
        return <NetworkConnectionError onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR:
        return <CallHelpCenter />
      default:
        return <></>
    }
  }

  return getSpecificErrorComponent(props)
}

export default ErrorComponent
