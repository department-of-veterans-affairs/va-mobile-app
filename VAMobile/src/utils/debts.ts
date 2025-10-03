import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { head, last } from 'underscore'

import { DebtRecord } from 'api/types/DebtData'
import { numberToUSDollars } from 'utils/formattingUtils'

const DATE_FORMAT = 'MM/dd/yyyy'

export type DebtVariantTypes = 'info' | 'warning'

export type DebtInfo = {
  balance: string
  endDate: string
  header: string
  i18nKey: string
  resolvable: boolean
  updatedDate?: string
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

  const parsedDate = DateTime.fromFormat(date, DATE_FORMAT)
  if (!parsedDate.isValid) {
    return fallbackMessage
  }

  const newDate = parsedDate.plus({ days: daysToAdd })
  return newDate.toFormat('MMMM d, yyyy')
}

// Leveraged from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/containers/DebtDetails.jsx
const getUpdatedDate = (debt: DebtRecord): string | undefined => {
  const lastHistory = last(debt.attributes.debtHistory ?? [])
  const lastUpdatedDate = lastHistory?.date
  if (lastUpdatedDate) {
    const parsedDate = DateTime.fromFormat(lastUpdatedDate, DATE_FORMAT)
    if (parsedDate.isValid) {
      const formattedDate = parsedDate.toFormat('MMMM d, yyyy')
      return formattedDate
    }
  }
  return undefined
}

// Leverated from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/const/diary-codes/debtSummaryCardContent.js
export const getDebtInfo = (t: TFunction, debt: DebtRecord): DebtInfo => {
  // Determine header based on deduction code mapping
  const deductionCode = debt.attributes.deductionCode
  const codeKey = Object.keys(deductionCodeMapping).find((key) => deductionCodeMapping[key].includes(deductionCode))
  const header = codeKey ? t(codeKey) : debt.attributes.benefitType
  let i18nKey: string, resolvable: boolean, variant: DebtVariantTypes

  switch (debt.attributes.diaryCode) {
    case '71':
      i18nKey = 'verifyMilitaryStatus'
      resolvable = false
      variant = 'info'
      break
    case '655':
    case '817':
      i18nKey = 'submitFinancialStatusReport'
      resolvable = true
      variant = 'info'
      break
    case '212':
      i18nKey = 'updateAddress'
      resolvable = false
      variant = 'info'
      break
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      i18nKey = 'pausedCollection'
      resolvable = false
      variant = 'info'
      break
    case '439':
    case '449':
    case '459':
    case '100':
    case '102':
    case '130':
    case '140':
      i18nKey = 'payOrRequestHelpBy'
      resolvable = true
      variant = 'warning'
      break
    case '109':
      i18nKey = 'payOrRequestHelpAvoidInterest'
      resolvable = true
      variant = 'warning'
      break
    case '117':
      i18nKey = 'payPastDueOrRequestHelp'
      resolvable = true
      variant = 'warning'
      break
    case '123':
      i18nKey = 'payPastDueOrRequestHelpNow'
      resolvable = true
      variant = 'warning'
      break
    case '680':
      i18nKey = 'payOrRequestHelpSimple'
      resolvable = true
      variant = 'warning'
      break
    case '681':
    case '682':
      i18nKey = 'treasuryReducingPayments'
      resolvable = true
      variant = 'info'
      break
    case '600':
    case '601':
      i18nKey = 'continueMonthlyPayments'
      resolvable = true
      variant = 'info'
      break
    case '430':
    case '431':
      i18nKey = 'reducingEducationBenefits'
      resolvable = true
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
      i18nKey = 'reducingBenefitPayments'
      resolvable = true
      variant = 'info'
      break
    case '603':
    case '613':
      i18nKey = 'makePaymentOrRequestHelp'
      resolvable = true
      variant = 'warning'
      break
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      i18nKey = 'contactTreasuryDMS'
      resolvable = false
      variant = 'warning'
      break
    case '500':
    case '510':
    case '503':
      i18nKey = 'referringToTreasury'
      resolvable = true
      variant = 'warning'
      break
    case '811':
      i18nKey = 'reviewCompromiseOffer'
      resolvable = true
      variant = 'info'
      break
    case '815':
      i18nKey = 'payCompromiseAgreement'
      resolvable = true
      variant = 'warning'
      break
    case '816':
      i18nKey = 'processingCompromisePayment'
      resolvable = false
      variant = 'info'
      break
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      i18nKey = 'reviewWaiverRequest'
      resolvable = true
      variant = 'info'
      break
    case '822':
      i18nKey = 'reviewDispute'
      resolvable = true
      variant = 'info'
      break
    case '825':
      i18nKey = 'reviewHearingRequest'
      resolvable = true
      variant = 'info'
      break
    case '821':
      i18nKey = 'reviewNoticeOfDisagreement'
      resolvable = true
      variant = 'info'
      break
    case '481':
    case '482':
    case '483':
    case '484':
      i18nKey = 'reviewingAccount'
      resolvable = false
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
      i18nKey = 'updatingAccount'
      resolvable = false
      variant = 'info'
      break
  }

  return {
    balance: numberToUSDollars(debt.attributes.currentAr),
    endDate: getEndDate(t, debt),
    header,
    i18nKey,
    resolvable,
    updatedDate: getUpdatedDate(debt),
    variant,
  }
}
