import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { head } from 'underscore'

import { DebtRecord } from 'api/types/DebtData'
import { numberToUSDollars } from 'utils/formattingUtils'

export type DebtVariantTypes = 'info' | 'warning'

export type DebtInfo = {
  balance: string
  endDate: string
  header: string
  summaryKey: string
  variant: string
}

// Leveraged from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/const/deduction-codes/index.js
const deductionCodeMapping: Record<string, string[]> = {
  'debts.deductionCode.chapter33': ['73', '76', '77', '78', '79'],
  'debts.deductionCode.chapter34': ['41'],
  'debts.deductionCode.chapter35': ['44'],
  'debts.deductionCode.disabilityComp': ['30'],
  'debts.deductionCode.post911Books': ['11', '12', '13', '14', '15', '27', '28', '71'],
  'debts.deductionCode.post911Housing': ['16', '17', '18', '19', '20', '48', '49', '50', '51', '72'],
  'debts.deductionCode.post911School': ['75'],
  'debts.deductionCode.post911Tuition': ['74'],
}

// Leveraged from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/utils/helpers.js
const getEndDate = (t: TFunction, debt: DebtRecord): string => {
  const mostRecentHistory = head(debt.attributes.debtHistory ?? [])
  const date = mostRecentHistory?.date
  const diaryCode = debt.attributes.diaryCode
  const daysToAdd = diaryCode === '117' || diaryCode === '123' ? 60 : 30

  const fallbackMessage = t('debts.endDate.fallback', { daysToAdd })

  if (!date) {
    return fallbackMessage
  }

  const parsedDate = DateTime.fromFormat(date, 'MM/dd/yyyy')
  if (!parsedDate.isValid) {
    return fallbackMessage
  }

  const newDate = parsedDate.plus({ days: daysToAdd })
  return newDate.toFormat('MMMM d, yyyy')
}

export const getDebtInfo = (t: TFunction, debt: DebtRecord): DebtInfo => {
  // Determine header based on deduction code mapping
  const deductionCode = debt.attributes.deductionCode
  const codeKey = Object.keys(deductionCodeMapping).find((key) => deductionCodeMapping[key].includes(deductionCode))
  const header = codeKey ? t(codeKey) : debt.attributes.benefitType
  let summaryKey: string, variant: DebtVariantTypes

  switch (debt.attributes.diaryCode) {
    case '71':
      summaryKey = 'debts.summary.verifyMilitaryStatus'
      variant = 'info'
      break
    case '655':
    case '817':
      summaryKey = 'debts.summary.submitFinancialStatusReport'
      variant = 'info'
      break
    case '212':
      summaryKey = 'debts.summary.updateAddress'
      variant = 'info'
      break
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      summaryKey = 'debts.summary.pausedCollection'
      variant = 'info'
      break
    case '439':
    case '449':
    case '459':
    case '100':
    case '102':
    case '130':
    case '140':
      summaryKey = 'debts.summary.payOrRequestHelpBy'
      variant = 'warning'
      break
    case '109':
      summaryKey = 'debts.summary.payOrRequestHelpAvoidInterest'
      variant = 'warning'
      break
    case '117':
      summaryKey = 'debts.summary.payPastDueOrRequestHelp'
      variant = 'warning'
      break
    case '123':
      summaryKey = 'debts.summary.payPastDueOrRequestHelpNow'
      variant = 'warning'
      break
    case '680':
      summaryKey = 'debts.summary.payOrRequestHelpSimple'
      variant = 'warning'
      break
    case '681':
    case '682':
      summaryKey = 'debts.summary.treasuryReducingPayments'
      variant = 'info'
      break
    case '600':
    case '601':
      summaryKey = 'debts.summary.continueMonthlyPayments'
      variant = 'info'
      break
    case '430':
    case '431':
      summaryKey = 'debts.summary.reducingEducationBenefits'
      variant = 'info'
      break
    case '101':
    case '450':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      summaryKey = 'debts.summary.reducingBenefitPayments'
      variant = 'info'
      break
    case '603':
    case '613':
      summaryKey = 'debts.summary.makePaymentOrRequestHelp'
      variant = 'warning'
      break
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      summaryKey = 'debts.summary.contactTreasuryDMS'
      variant = 'warning'
      break
    case '500':
    case '510':
    case '503':
      summaryKey = 'debts.summary.referringToTreasury'
      variant = 'warning'
      break
    case '811':
      summaryKey = 'debts.summary.reviewCompromiseOffer'
      variant = 'info'
      break
    case '815':
      summaryKey = 'debts.summary.payCompromiseAgreement'
      variant = 'warning'
      break
    case '816':
      summaryKey = 'debts.summary.processingCompromisePayment'
      variant = 'info'
      break
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      summaryKey = 'debts.summary.reviewWaiverRequest'
      variant = 'info'
      break
    case '822':
      summaryKey = 'debts.summary.reviewDispute'
      variant = 'info'
      break
    case '825':
      summaryKey = 'debts.summary.reviewHearingRequest'
      variant = 'info'
      break
    case '821':
      summaryKey = 'debts.summary.reviewNoticeOfDisagreement'
      variant = 'info'
      break
    case '481':
    case '482':
    case '483':
    case '484':
      summaryKey = 'debts.summary.reviewingAccount'
      variant = 'info'
      break
    case '002':
    case '005':
    case '032':
    case '609':
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '627':
    case '425':
    default:
      summaryKey = 'debts.summary.updatingAccount'
      variant = 'info'
      break
  }

  return {
    balance: numberToUSDollars(debt.attributes.currentAr),
    endDate: getEndDate(t, debt),
    header,
    summaryKey,
    variant,
  }
}
