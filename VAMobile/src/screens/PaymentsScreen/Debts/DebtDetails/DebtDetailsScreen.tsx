import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { AlertWithHaptics, Box, FeatureLandingTemplate, LinkWithAnalytics, MultiTouchCard, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { getDebtInfo } from 'utils/debts'
import { useTheme } from 'utils/hooks'

type DebtDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtDetails'>

function DebtDetailsScreen({ route, navigation }: DebtDetailsScreenProps) {
  const { debt } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const debtInfo = getDebtInfo(t, debt)

  function renderAlert() {
    return (
      <AlertWithHaptics
        variant={debtInfo.variant === 'info' ? 'info' : 'warning'}
        expandable={true}
        header={t(`debts.details.alert.header.${debtInfo.i18nKey}`, {
          balance: debtInfo.balance,
          endDate: debtInfo.endDate,
        })}>
        {/* TODO: add alert content */}
      </AlertWithHaptics>
    )
  }

  function renderCard() {
    const mainContent = (
      <>
        {/* Header */}
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
          {debtInfo.header}
        </TextView>
        {/* Current balance */}
        <TextView variant="DebtLabel">{t('debts.details.currentBalance')}</TextView>
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="DebtValueLarge">
          {debtInfo.balance}
        </TextView>
        {/* Original amount */}
        <TextView variant="DebtLabel">{t('debts.details.originalAmount')}</TextView>
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="DebtValue">
          {debtInfo.original}
        </TextView>
        {/* Payment due date */}
        <TextView variant="DebtLabel">{t('debts.details.paymentDueDate')}</TextView>
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="DebtValue">
          {debtInfo.endDate}
        </TextView>
        {/* Resolve debt button */}
        {debtInfo.resolvable && <ResolveDebtButton debt={debt} />}
      </>
    )
    return <MultiTouchCard mainContent={mainContent} />
  }

  function renderUpdatedDate() {
    return (
      debtInfo.updatedDate && (
        <TextView mb={theme.dimensions.standardMarginBetween}>
          {t('debts.details.updated', { date: debtInfo.updatedDate })}
        </TextView>
      )
    )
  }

  function renderWhyDebtLink() {
    return (
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
    )
  }

  function renderContent() {
    return (
      <Box mx={theme.dimensions.gutter}>
        {renderUpdatedDate()}
        {renderAlert()}
        {renderWhyDebtLink()}
        {renderCard()}
      </Box>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('debts')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.details.title')}
      testID="debtDetailsTestID"
      backLabelTestID="debtDetailsBackTestID">
      {renderContent()}
    </FeatureLandingTemplate>
  )
}

export default DebtDetailsScreen
