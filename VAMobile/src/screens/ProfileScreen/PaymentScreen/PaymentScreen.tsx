import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { ProfileStackParamList } from '../ProfileStackScreens'

type PaymentScreenProps = StackScreenProps<ProfileStackParamList, 'Payments'>

const PaymentScreen: FC<PaymentScreenProps> = () => {
  return <></>
}

export default PaymentScreen
