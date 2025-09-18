import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'

type TransactionDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'TransactionDetails'>

function TransactionDetailsScreen({ navigation }: TransactionDetailsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <FeatureLandingTemplate
      backLabel={t('debts.overpayment')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.transactionDetails.title')}
      testID="transactionDetailsTestID"
      backLabelTestID="transactionDetailsBackTestID"
    />
  )
}

export default TransactionDetailsScreen
