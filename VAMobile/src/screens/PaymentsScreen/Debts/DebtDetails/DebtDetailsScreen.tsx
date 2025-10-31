import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useTheme } from 'utils/hooks'

type DebtDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtDetails'>

function DebtDetailsScreen({ route, navigation }: DebtDetailsScreenProps) {
  const { debt } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <FeatureLandingTemplate
      backLabel={t('debts')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.details.title')}
      testID="debtDetailsTestID"
      backLabelTestID="debtDetailsBackTestID">
      {/* TODO: Temporary code */}
      <Box mx={theme.dimensions.cardPadding}>
        <ResolveDebtButton debt={debt} />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DebtDetailsScreen
