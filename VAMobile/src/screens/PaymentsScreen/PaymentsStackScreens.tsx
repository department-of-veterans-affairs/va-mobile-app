import React, { ReactNode } from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { DebtRecord, MedicalCopayDetail, MedicalCopayRecord, PaymentsData } from 'api/types'
import { LARGE_PANEL_OPTIONS } from 'constants/screens'
import CopaysHelp from 'screens/PaymentsScreen/Copays/CopayHelp/CopayHelp'
import TermDefinitions from 'screens/PaymentsScreen/Debts/TermDefinitions/TermDefinitions'
import DebtHelp, { debtHelpType } from 'screens/PaymentsScreen/Debts/DebtHelp/DebtHelp'
import PaymentIssue from 'screens/PaymentsScreen/PaymentHistory/PaymentIssueScreen/PaymentIssueScreen'
import PaymentMissing from 'screens/PaymentsScreen/PaymentHistory/PaymentMissingSceen/PaymentMissingScreen'

export type PaymentsStackParamList = {
  Payments: undefined
  DirectDeposit: undefined
  EditDirectDeposit: {
    isEdit: boolean
  }
  HowToUpdateDirectDeposit: undefined
  PaymentHistory: undefined
  PaymentDetails: {
    payment: PaymentsData
  }
  PaymentIssue: undefined
  PaymentMissing: undefined
  Copays: undefined
  ChargeDetails: {
    details: MedicalCopayDetail
  }
  CopayDetails: {
    copay: MedicalCopayRecord
  }
  CopayHelp: undefined
  CopayRequestHelp: undefined
  DisputeCopay: undefined
  PayBill: {
    copay: MedicalCopayRecord
  }
  Debts: undefined
  DebtDetails: {
    debt: DebtRecord
  }
  DebtHelp: { helpType: debtHelpType }
  DebtRequestHelp: undefined
  DisputeDebt: undefined
  PayDebt: {
    debt: DebtRecord
  }
  TermDefinitions: undefined
  NoticeOfRights: undefined
}

const PaymentsStack = createStackNavigator<PaymentsStackParamList>()

export const getPaymentsScreens = (): Array<ReactNode> => {
  return [
    <PaymentsStack.Screen
      key={'PaymentIssue'}
      name="PaymentIssue"
      component={PaymentIssue}
      options={LARGE_PANEL_OPTIONS}
    />,
    <PaymentsStack.Screen
      key={'PaymentMissing'}
      name="PaymentMissing"
      component={PaymentMissing}
      options={LARGE_PANEL_OPTIONS}
    />,
    <PaymentsStack.Screen key={'CopayHelp'} name="CopayHelp" component={CopaysHelp} options={LARGE_PANEL_OPTIONS} />,
    <PaymentsStack.Screen key={'DebtHelp'} name="DebtHelp" component={DebtHelp} options={LARGE_PANEL_OPTIONS} />,
    <PaymentsStack.Screen
      key={'TermDefinitions'}
      name="TermDefinitions"
      component={TermDefinitions}
      options={LARGE_PANEL_OPTIONS}
    />,
  ]
}
