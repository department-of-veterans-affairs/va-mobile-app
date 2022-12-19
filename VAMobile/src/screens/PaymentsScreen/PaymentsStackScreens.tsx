import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import HowToUpdateDirectDepositScreen from './DirectDepositScreen/HowToUpdateDirectDepositScreen'
import PaymentDetailsScreen from './PaymentHistory/PaymentDetailsScreen/PaymentDetailsScreen'
import PaymentIssue from './PaymentHistory/PaymentIssueScreen/PaymentIssueScreen'
import PaymentMissing from './PaymentHistory/PaymentMissingSceen/PaymentMissingScreen'

export type PaymentsStackParamList = {
  Payments: undefined
  DirectDeposit: undefined
  HowToUpdateDirectDeposit: undefined
  PaymentHistory: undefined
  PaymentDetails: {
    paymentID: string
  }
  PaymentIssue: undefined
  PaymentMissing: undefined
}

const PaymentsStack = createStackNavigator<PaymentsStackParamList>()

export const getPaymentsScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <PaymentsStack.Screen
      key={'HowToUpdateDirectDeposit'}
      name="HowToUpdateDirectDeposit"
      component={HowToUpdateDirectDepositScreen}
      options={{ title: t('directDeposit.title') }}
    />,
    <PaymentsStack.Screen key={'PaymentDetails'} name="PaymentDetails" component={PaymentDetailsScreen} options={{ title: t('profile:paymentDetails.title') }} />,
    <PaymentsStack.Screen key={'PaymentIssue'} name="PaymentIssue" component={PaymentIssue} />,
    <PaymentsStack.Screen key={'PaymentMissing'} name="PaymentMissing" component={PaymentMissing} />,
  ]
}
