import React from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'

type DisputeDebtScreenProps = StackScreenProps<PaymentsStackParamList, 'DisputeDebt'>

function DisputeDebtScreen({ navigation }: DisputeDebtScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'DebtDetails' ? t('debts.overpayment') : t('debts')

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('debts.disputeDebt.title')}
      testID="disputeDebtTestID"
      backLabelTestID="disputeDebtBackTestID"
    />
  )
}

export default DisputeDebtScreen
