import { LARGE_PANEL_OPTIONS } from 'constants/screens'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import PaymentIssue from './PaymentHistory/PaymentIssueScreen/PaymentIssueScreen'
import PaymentMissing from './PaymentHistory/PaymentMissingSceen/PaymentMissingScreen'

export type PaymentsStackParamList = {
  Payments: undefined
  DirectDeposit: undefined
  EditDirectDeposit: {
    isEdit: boolean
  }
  HowToUpdateDirectDeposit: undefined
  PaymentHistory: undefined
  PaymentDetails: {
    paymentID: string
  }
  PaymentIssue: undefined
  PaymentMissing: undefined
}

const PaymentsStack = createStackNavigator<PaymentsStackParamList>()

export const getPaymentsScreens = (): Array<ReactNode> => {
  return [
    <PaymentsStack.Screen key={'PaymentIssue'} name="PaymentIssue" component={PaymentIssue} options={LARGE_PANEL_OPTIONS} />,
    <PaymentsStack.Screen key={'PaymentMissing'} name="PaymentMissing" component={PaymentMissing} options={LARGE_PANEL_OPTIONS} />,
  ]
}
