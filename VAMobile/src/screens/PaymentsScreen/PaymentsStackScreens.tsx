import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import DirectDepositScreen from './DirectDepositScreen'
import HowToUpdateDirectDepositScreen from './DirectDepositScreen/HowToUpdateDirectDepositScreen'
import PaymentDetailsScreen from './PaymentScreen/PaymentDetailsScreen/PaymentDetailsScreen'
import PaymentIssue from './PaymentScreen/PaymentIssueScreen/PaymentIssueScreen'
import PaymentMissing from './PaymentScreen/PaymentMissingSceen/PaymentMissingScreen'
import PaymentScreen from './PaymentScreen/PaymentHistoryScreen'

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
    <PaymentsStack.Screen key={'DirectDeposit'} name="DirectDeposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />,
    <PaymentsStack.Screen
      key={'HowToUpdateDirectDeposit'}
      name="HowToUpdateDirectDeposit"
      component={HowToUpdateDirectDepositScreen}
      options={{ title: t('directDeposit.title') }}
    />,
    <PaymentsStack.Screen key={'PaymentHistory'} name="PaymentHistory" component={PaymentScreen} options={{ title: t('home:payments.title') }} />,
    <PaymentsStack.Screen key={'PaymentDetails'} name="PaymentDetails" component={PaymentDetailsScreen} options={{ title: t('paymentDetails.title') }} />,
    <PaymentsStack.Screen key={'PaymentIssue'} name="PaymentIssue" component={PaymentIssue} />,
    <PaymentsStack.Screen key={'PaymentMissing'} name="PaymentMissing" component={PaymentMissing} />,
  ]
}
