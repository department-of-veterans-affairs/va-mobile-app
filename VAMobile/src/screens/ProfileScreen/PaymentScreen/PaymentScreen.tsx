import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { ErrorComponent } from 'components'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { useError } from 'utils/hooks'
import NoPaymentsScreen from './NoPayments/NoPaymentsScreen'

type PaymentScreenProps = StackScreenProps<ProfileStackParamList, 'Payments'>

const PaymentScreen: FC<PaymentScreenProps> = () => {
  const payments = false

  if (useError(ScreenIDTypesConstants.PAYMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PAYMENTS_SCREEN_ID} />
  }

  if (!payments) {
    return <NoPaymentsScreen />
  }

  return <></>
}

export default PaymentScreen
