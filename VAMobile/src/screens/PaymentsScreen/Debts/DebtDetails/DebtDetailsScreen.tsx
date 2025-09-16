import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type DebtDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtDetails'>

function DebtDetailsScreen({ navigation }: DebtDetailsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  return (
    <FeatureLandingTemplate
      backLabel={t('debts')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.details.title')}
      testID="debtDetailsTestID"
      backLabelTestID="debtDetailsBackTestID">
      {/* TODO: Temporary code to navigate to other screens */}
      <Box mx={theme.dimensions.cardPadding} my={theme.dimensions.buttonPadding}>
        <Button
          label={t('debts.transactionDetails.title')}
          onPress={() => {
            navigateTo('TransactionDetails') // TODO: add param when available
          }}
        />
      </Box>
      <ResolveDebtButton />
    </FeatureLandingTemplate>
  )
}

export default DebtDetailsScreen
