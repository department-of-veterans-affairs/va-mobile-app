import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { head, last } from 'underscore'

import { DebtHistory, DebtRecord } from 'api/types/DebtData'
import { numberToUSDollars } from 'utils/formattingUtils'

const FROM_DATE_FORMAT = 'MM/dd/yyyy'
const TO_DATE_FORMAT = 'MMMM d, yyyy'

export type DebtVariantTypes = 'info' | 'warning'

export type DebtInfo = {
  balance: string
  endDate: string
  header: string
  i18nKey: string
  original: string
  resolvable: boolean
  updatedDate?: string
  variant: string
  type?: string
  // expandedMessage: string
}

export type DebtLetterInfo = {
  date: string
  title: string
  description: string
}

export const ReviewSubmissionType = {
  CompromiseOffer: 'compromise offer',
  Dispute: 'dispute',
  WaiverRequest: 'waiver request',
} as const

export type ReviewSubmissionType = (typeof ReviewSubmissionType)[keyof typeof ReviewSubmissionType]

// Leveraged from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/containers/DebtDetails.jsx
const approvedLetterCodes = ['100', '101', '102', '109', '117', '123', '130']

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
// vets-website/src/applications/combined-debt-portal/debt-letters/containers/DebtDetails.jsx
export const getFilteredDebtHistory = (debt: DebtRecord): DebtHistory[] => {
  return (debt.attributes.debtHistory ?? [])
    .filter((history) => approvedLetterCodes.includes(history.letterCode))
    .reverse()
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

  const parsedDate = DateTime.fromFormat(date, FROM_DATE_FORMAT)
  if (!parsedDate.isValid) {
    return fallbackMessage
  }

  const newDate = parsedDate.plus({ days: daysToAdd })
  return newDate.toFormat(TO_DATE_FORMAT)
}

// Leveraged from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/containers/DebtDetails.jsx
const getUpdatedDate = (debt: DebtRecord): string | undefined => {
  const lastHistory = last(debt.attributes.debtHistory ?? [])
  const lastUpdatedDate = lastHistory?.date
  if (lastUpdatedDate) {
    const parsedDate = DateTime.fromFormat(lastUpdatedDate, FROM_DATE_FORMAT)
    if (parsedDate.isValid) {
      const formattedDate = parsedDate.toFormat(TO_DATE_FORMAT)
      return formattedDate
    }
  }
  return undefined
}

const getUnderReviewType = (diaryCode?: string): string | undefined => {
  switch (diaryCode) {
    case '811':
      return 'compromise offer'
    case '821':
    case '822':
    case '825':
      return 'dispute'
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      return 'waiver request'
    default:
      return undefined
  }
}

// Leverated from web implementation:
// vets-website/src/applications/combined-debt-portal/debt-letters/const/diary-codes/debtSummaryCardContent.js
export const getDebtInfo = (t: TFunction, debt: DebtRecord): DebtInfo => {
  // Determine header based on deduction code mapping
  const deductionCode = debt.attributes.deductionCode
  const codeKey = Object.keys(deductionCodeMapping).find((key) => deductionCodeMapping[key].includes(deductionCode))
  const header = codeKey ? t(codeKey) : debt.attributes.benefitType
  let i18nKey: string, resolvable: boolean, variant: DebtVariantTypes
  // let expandedMessage: string = ""
  // let messageValues: Record<string, string | number | undefined> = {}
  let type: string | undefined

  switch (debt.attributes.diaryCode) {
    // Should there be a 0 in front or no?
    case '71':
      i18nKey = 'verifyMilitaryStatus'
      resolvable = false
      variant = 'info'

      // expandedMessage = t('debt.details.alert.message.verifyMilitaryStatus')

      break

    case '655':
    case '817':
      i18nKey = 'submitFinancialStatusReport'
      resolvable = true
      variant = 'info'

      // expandedMessage = t('debt.details.alert.message.submitFinancialStatusReport')

      break

    case '212':
      // Address needed
      i18nKey = 'updateAddress'
      resolvable = false
      variant = 'info'

      // expandedMessage = t('debt.details.alert.message.updateAddress')

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

      // expandedMessage = t('debt.details.alert.message.pausedCollection')

      break

    case '100':
    case '101':
    case '102':
    case '130':
    case '140':
      // Make a payment - Currnetly due, maybe change name later?
      i18nKey = 'payOrRequestHelpBy'
      resolvable = true
      variant = 'warning'

      // expandedMessage = t('debt.details.alert.message.payOrRequestHelpBy', {
      //   balance: numberToUSDollars(debt.attributes.currentAr),
      //   endDate: getEndDate(t, debt)
      // })

      break

    case '109':
    case '117':
    case '123':
    case '439':
    case '449':
    case '459':
    case '680':
    case '603':
    case '613':
      // Payment overdue
      i18nKey = 'payOrRequestHelpAvoidInterest'
      resolvable = true
      variant = 'warning'

      // expandedMessage = t('debt.details.alert.message.payOrRequestHelpAvoidInterest', {
      //   balance: numberToUSDollars(debt.attributes.currentAr),
      //   endDate: getEndDate(t, debt)
      // })

      break

    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
    case '681':
    case '682':
      // Sent to treasury
      i18nKey = 'contactTreasuryDMS'
      resolvable = false
      variant = 'warning'

      // expandedMessage = t('debt.details.alert.message.contactTreasuryDMS')

      break

    case '081':
    case '500':
    case '503':
    case '510':
      // Being Sent to treasury soon
      i18nKey = 'referringToTreasury'
      resolvable = true
      variant = 'warning'

      // expandedMessage = t('debt.details.alert.message.referringToTreasury')

      break

    case '815':
      i18nKey = 'payCompromiseAgreement'
      resolvable = true
      variant = 'warning'

      // expandedMessage = t('debt.details.alert.message.payCompromiseAgreement', {
      //   balance: numberToUSDollars(debt.attributes.currentAr),
      //   endDate: getEndDate(t, debt)
      // })

      break

    case '600':
    case '601':
      i18nKey = 'continueMonthlyPayments'
      resolvable = true
      variant = 'info'

      // expandedMessage = t('debt.details.alert.message.continueMonthlyPayments')

      break

    case '450':
    // two 101's???
    case '101':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
    case '430':
    case '431':
      i18nKey = 'reducingBenefitPayments'
      resolvable = true
      variant = 'info'

      // expandedMessage = t('debt.details.alert.message.reducingBenefitPayments')

      break

    case '811':
    case '821':
    case '822':
    case '825':
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      // Under Review
      i18nKey = 'reviewWaiverRequest' // make a new one
      resolvable = true
      variant = 'info'

      // const type = getUnderReviewType(debt.attributes.diaryCode)
      // expandedMessage = t('debt.details.alert.message.reviewWaiverRequest', {
      //   type: type // ?? 'request', // fallback if something weird happens
      // })
      // messageValues = {
      //   type: getUnderReviewType(debt.attributes.diaryCode),
      // }
      type = getUnderReviewType(debt.attributes.diaryCode)
      break
    // Do diary codes less than 100 come in with 0's or by themselves (i.e. 002 vs. 2)
    case '002':
    case '005':
    case '032':
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '609':
    case '627':
    case '481':
    case '482':
    case '483':
    case '484':
    case '816':
    default:
      i18nKey = 'updatingAccount'
      resolvable = false
      variant = 'info'

      // expandedMessage = t('debt.details.alert.message.updatingAccount')

      break
  }

  return {
    balance: numberToUSDollars(debt.attributes.currentAr),
    endDate: getEndDate(t, debt),
    header,
    i18nKey,
    original: numberToUSDollars(debt.attributes.originalAr),
    resolvable,
    updatedDate: getUpdatedDate(debt),
    variant,
    type,
  }
}

export const getDebtLetterInfo = (t: TFunction, debt: DebtRecord, debtHistory: DebtHistory): DebtLetterInfo => {
  const parsedDate = DateTime.fromFormat(debtHistory.date, FROM_DATE_FORMAT)
  const date = parsedDate.isValid ? parsedDate.toFormat(TO_DATE_FORMAT) : ''

  // Leveraged from web implementation:
  // vets-website/src/applications/combined-debt-portal/debt-letters/const/diary-codes/index.js
  let title: string, description: string
  switch (debtHistory.letterCode) {
    case '100':
    case '101':
    case '102':
    case '109':
      title = t('debts.letter.firstDemand.title')
      description = t('debts.letter.firstDemand.description')
      break
    case '117':
      title = t('debts.letter.secondDemand.title')
      description = t('debts.letter.secondDemand.description')
      break
    case '123':
      title = t('debts.letter.secondDemand.title')
      description = t('debts.letter.secondDemand.description')
      break
    case '130':
      title = t('debts.letter.increase.title')
      description = t('debts.letter.increase.description')
      break
    default:
      title = description = ''
      break
  }
  return {
    date,
    title,
    description,
  }
}
