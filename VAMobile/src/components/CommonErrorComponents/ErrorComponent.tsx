import React, { FC } from 'react'

import { ErrorsState, StoreState } from 'store'
import { NetworkConnectionError } from 'components'
import { useSelector } from 'react-redux'

export type ErrorComponentProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
}

const ErrorComponent: FC<ErrorComponentProps> = (props) => {
  const { wasError, networkConnectionError } = useSelector<StoreState, ErrorsState>((s) => s.errors)

  const getSpecificErrorComponent: FC<ErrorComponentProps> = ({ onTryAgain }) => {
    // check which specific error occurred and return the corresponding error element
    if (networkConnectionError) {
      return <NetworkConnectionError onTryAgain={onTryAgain} />
    } else {
      return <></>
    }
  }

  if (!wasError) {
    return <></>
  }

  return getSpecificErrorComponent(props)
}

export default ErrorComponent
