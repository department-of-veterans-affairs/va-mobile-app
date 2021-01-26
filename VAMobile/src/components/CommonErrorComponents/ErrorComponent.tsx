import React, { FC } from 'react'

import { CommonErrors } from 'constants/errors'
import { ErrorsState, StoreState } from 'store'
import { NetworkConnectionError } from 'components'
import { useSelector } from 'react-redux'

export type ErrorComponentProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
}

const ErrorComponent: FC<ErrorComponentProps> = (props) => {
  const { wasError, errorType, lastAction } = useSelector<StoreState, ErrorsState>((s) => s.errors)

  const getSpecificErrorComponent: FC<ErrorComponentProps> = ({ onTryAgain }) => {
    const tryAgain = onTryAgain ? onTryAgain : lastAction

    // check which specific error occurred and return the corresponding error element
    switch (errorType) {
      case CommonErrors.NETWORK_CONNECTION_ERROR:
        return <NetworkConnectionError onTryAgain={tryAgain} />
      default:
        return <></>
    }
  }

  if (!wasError) {
    return <></>
  }

  return getSpecificErrorComponent(props)
}

export default ErrorComponent
