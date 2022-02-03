import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { ProfileStackParamList } from '../ProfileStackScreens'
import NoPaymentsScreen from './NoPayments/NoPaymentsScreen'

type PaymentScreenProps = StackScreenProps<ProfileStackParamList, 'Payments'>

const PaymentScreen: FC<PaymentScreenProps> = () => {
  const payments = false

  if (!payments) {
    return <NoPaymentsScreen />
  }

  return <></>
}

export default PaymentScreen
