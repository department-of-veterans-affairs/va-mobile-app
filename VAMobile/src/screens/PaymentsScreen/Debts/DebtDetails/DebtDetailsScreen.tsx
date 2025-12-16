import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { DebtHistory, DebtTransaction } from 'api/types/DebtData'
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
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import NoticeOfRightsButton from 'screens/PaymentsScreen/NoticeOfRights/NoticeOfRightsButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getDebtInfo, getDebtLetterInfo, getFilteredDebtHistory } from 'utils/debts'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber, numberToUSDollars } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import { useRouteNavigation } from 'utils/hooks'

type DebtDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtDetails'>

function DebtDetailsScreen({ route, navigation }: DebtDetailsScreenProps) {
  const { debt } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const debtInfo = getDebtInfo(t, debt)
  const navigateTo = useRouteNavigation()

  function renderAlert() {
    return (
      <AlertWithHaptics
        variant={debtInfo.variant === 'info' ? 'info' : 'warning'}
        expandable={false} // TODO: change to true when alert content is added
        header={t(`debts.details.alert.header.${debtInfo.i18nKey}`, {
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

  function renderTransactionHistory(transactions: DebtTransaction[]) {
    const rows = transactions.map((tx) => {
      const rawAmount =
        tx.transactionTotalAmount ?? tx.transactionPrincipalAmount ?? tx.debtIncreaseAmount ?? tx.offsetAmount ?? 0

      const isDecrease = rawAmount < 0
      const absAmount = Math.abs(rawAmount || 0)
      const formattedAmount = numberToUSDollars(absAmount)
      const amountText = isDecrease ? `-${formattedAmount}` : formattedAmount

      const title =
        tx.transactionDescription ||
        tx.transactionExplanation ||
        t(isDecrease ? 'debts.transaction.history.balanceDecrease' : 'debts.transaction.history.balanceIncrease')

      return (
        <Box
          key={`${tx.debtId}-${tx.transactionDate}-${title}`}
          borderTopWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.divider as BorderColorVariant}
          mt={theme.dimensions.standardMarginBetween}>
          <TextView mt={theme.dimensions.standardMarginBetween} variant="HelperText">
            {tx.transactionDate}
          </TextView>
          <TextView my={theme.dimensions.tinyMarginBetween} variant="vadsFontHeadingXsmall">
            {title}
          </TextView>
          <TextView variant="MobileBody">{amountText}</TextView>
        </Box>
      )
    })

    const expandedContent = (
      <>
        <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('debts.transaction.history.description')}
        </TextView>
        {rows}
      </>
    )

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <AccordionCollapsible
          header={
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('debts.transaction.history.header')}
            </TextView>
          }
          expandedContent={expandedContent}
          testID="debtTransactionHistoryAccordionID"
        />
      </Box>
    )
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
      <Box>
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
    const { LINK_URL_ASK_VA_GOV } = getEnv()
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
          <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody" paragraphSpacing={false}>
            {t('debts.help.orContactAskVA')}
          </TextView>
          <LinkWithAnalytics
            type="custom"
            onPress={() => {
              logAnalyticsEvent(Events.vama_webview(LINK_URL_ASK_VA_GOV))
              navigateTo('Webview', {
                url: LINK_URL_ASK_VA_GOV,
                displayTitle: t('webview.vagov'),
                loadingMessage: t('loading.vaWebsite'),
                useSSO: false,
              })
            }}
            text={t('debts.help.askVA')}
            a11yLabel={a11yLabelVA(t('debts.help.askVA'))}
            a11yHint={t('debts.help.askVAA11yHint')}
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
    const transactionHistory = debt.attributes.fiscalTransactionData ?? []
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
        {transactionHistory.length > 0 && renderTransactionHistory(transactionHistory)}
        {debtHistory.length > 0 && renderDebtHistory(debtHistory)}
        <NoticeOfRightsButton />
        {renderHelp()}
      </>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('debts.details.backButton.title')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.details.title')}
      testID="debtDetailsTestID"
      backLabelTestID="debtDetailsBackTestID">
      {renderContent()}
    </FeatureLandingTemplate>
  )
}

export default DebtDetailsScreen
