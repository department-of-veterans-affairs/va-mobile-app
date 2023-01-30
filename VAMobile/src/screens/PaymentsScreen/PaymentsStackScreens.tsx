import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import PaymentDetailsScreen from './PaymentHistory/PaymentDetailsScreen/PaymentDetailsScreen'
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
    <PaymentsStack.Screen key={'PaymentDetails'} name="PaymentDetails" component={PaymentDetailsScreen} options={{ headerShown: false }} />,
    <PaymentsStack.Screen
      key={'PaymentIssue'}
      name="PaymentIssue"
      component={PaymentIssue}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <PaymentsStack.Screen
      key={'PaymentMissing'}
      name="PaymentMissing"
      component={PaymentMissing}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
  ]
}
