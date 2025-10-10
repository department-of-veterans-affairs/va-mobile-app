import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { DebtHistory } from 'api/types/DebtData'
import {
  AccordionCollapsible,
  AlertWithHaptics,
  BorderColorVariant,
  Box,
  ClickToCallPhoneNumber,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  MultiTouchCard,
  TextArea,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { getDebtInfo, getDebtLetterInfo, getFilteredDebtHistory } from 'utils/debts'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
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
        <TextView variant="HelperText">{t('debts.details.currentBalance')}</TextView>
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="vadsFontHeadingMedium">
          {debtInfo.balance}
        </TextView>
        {/* Original amount */}
        <TextView variant="HelperText">{t('debts.details.originalAmount')}</TextView>
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {debtInfo.original}
        </TextView>
        {/* Payment due date */}
        <TextView variant="HelperText">{t('debts.details.paymentDueDate')}</TextView>
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {debtInfo.endDate}
        </TextView>
        {/* Resolve debt button */}
        {debtInfo.resolvable && <ResolveDebtButton debt={debt} />}
      </>
    )
    return <MultiTouchCard mainContent={mainContent} />
  }

  // Leveraged from web implementation:
  // vets-website/src/applications/combined-debt-portal/debt-letters/components/HistoryTable.jsx
  function renderDebtHistory(debtHistory: DebtHistory[]) {
    const letters = debtHistory.map((letter) => {
      const debtLetterInfo = getDebtLetterInfo(t, debt, letter)
      return (
        <Box
          borderTopWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.divider as BorderColorVariant}
          mt={theme.dimensions.standardMarginBetween}>
          <TextView mt={theme.dimensions.standardMarginBetween} variant="HelperText">
            {debtLetterInfo.date}
          </TextView>
          <TextView my={theme.dimensions.tinyMarginBetween} variant="vadsFontHeadingXsmall">
            {debtLetterInfo.title}
          </TextView>
          <TextView variant="HelperText">{debtLetterInfo.description}</TextView>
        </Box>
      )
    })
    const expandedContent = (
      <>
        <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('debts.letter.history.description')}
        </TextView>
        {letters}
      </>
    )
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <AccordionCollapsible
          header={
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('debts.letter.history.header')}
            </TextView>
          }
          expandedContent={expandedContent}
          testID="debtLetterHistoryAccordionID"
        />
      </Box>
    )
  }

  function renderHelp() {
    return (
      <Box my={theme.dimensions.standardMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.help.questions.header')}
          </TextView>
          <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('debts.help.questions.body.1')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('8008270648')} displayedText={displayedTextPhoneNumber(t('8008270648'))} />
          <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('debts.help.questions.body.2')}
          </TextView>
          <ClickToCallPhoneNumber
            phone={t('16127136415')}
            displayedText={displayedTextPhoneNumber(t('16127136415'))}
            ttyBypass={true}
          />
        </TextArea>
      </Box>
    )
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
    const debtHistory = getFilteredDebtHistory(debt)
    console.log('debt.attributes.debtHistory', debt.attributes.debtHistory)
    console.log('debtHistory', debtHistory)
    return (
      <>
        <Box mx={theme.dimensions.gutter}>
          {renderUpdatedDate()}
          {renderAlert()}
          {renderWhyDebtLink()}
          {renderCard()}
        </Box>
        {debtHistory.length > 0 && renderDebtHistory(debtHistory)}
        {renderHelp()}
      </>
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
