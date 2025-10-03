import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { AlertWithHaptics, Box, FeatureLandingTemplate, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { getDebtInfo } from 'utils/debts'
import { useTheme } from 'utils/hooks'

type DebtDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtDetails'>

function DebtDetailsScreen({ route, navigation }: DebtDetailsScreenProps) {
  const { debt } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const debtInfo = getDebtInfo(t, debt)

  return (
    <FeatureLandingTemplate
      backLabel={t('debts')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.details.title')}
      testID="debtDetailsTestID"
      backLabelTestID="debtDetailsBackTestID">
      <Box mx={theme.dimensions.gutter}>
        {/* Updated date */}
        {debtInfo.updatedDate && (
          <TextView mb={theme.dimensions.standardMarginBetween}>
            {t('debts.details.updated', { date: debtInfo.updatedDate })}
          </TextView>
        )}
        {/* Alert box */}
        <AlertWithHaptics
          variant={debtInfo.variant === 'info' ? 'info' : 'warning'}
          expandable={true}
          header={t(`debts.details.alert.header.${debtInfo.i18nKey}`, {
            balance: debtInfo.balance,
            endDate: debtInfo.endDate,
          })}>
          {/* TODO: add alert content */}
        </AlertWithHaptics>
        {/* Why might I have this debt link */}
        <Box my={theme.dimensions.condensedMarginBetween}>
          <LinkWithAnalytics
            type="custom"
            text={t('debts.help.why.header')}
            testID="debtsHelpWhyLinkID"
            onPress={() => {
              navigation.navigate('DebtHelp', {
                // Leveraged from web implementation:
                // vets-website/src/applications/combined-debt-portal/debt-letters/const/deduction-codes/index.js
                helpType: debt.attributes.deductionCode === '30' ? 'whyDisabilityPensionDebt' : 'whyEducationDebt',
              })
            }}
          />
        </Box>
        {/* TODO: add remaining content */}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DebtDetailsScreen
