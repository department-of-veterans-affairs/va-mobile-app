import { TFunction } from 'i18next'

import { a11yLabelID } from 'utils/a11yLabel'
import { formatDateUtc } from 'utils/formattingUtils'

/**
 * Returns the display text and accessibilityLabel value for rxNumber used in Prescriptions. Defaults to 'None noted' if not given.
 * @param t - translation set with `useTranslation(NAMESPACE.COMMON)`
 * @param prescriptionNumber - number of prescriptions
 *
 * ex. returns [`Rx #: 1231` | `None Noted`, `Rx number 1 2 3 1` | `None Noted`]
 */
export const getRxNumberTextAndLabel = (t: TFunction, prescriptionNumber?: string) => {
  const noneNoted = t('noneNoted')
  const rxNumber = `${t('prescription.rxNumber')} ${prescriptionNumber || noneNoted}`
  const rxNumberA11yLabel = `${t('prescription.rxNumber.a11yLabel')} ${a11yLabelID(prescriptionNumber) || noneNoted}`
  return [rxNumber, rxNumberA11yLabel]
}

/**
 * Returns the display text and accessibilityLabel value for date used in Prescriptions. Defaults to 'None noted' if not given.
 * @param t - translation set with `useTranslation(NAMESPACE.COMMON)`
 * @param date - date passed in
 *
 * ex. returns ['01/02/2023' | `None Noted`, `January 2nd, 20223` | `None Noted`]
 */
export const getDateTextAndLabel = (t: TFunction, date: string | null) => {
  const noneNoted = t('noneNoted')
  const dateMMddyyyy = date ? formatDateUtc(date, 'MM/dd/yyyy') : noneNoted
  const dateA11yLabel = date ? formatDateUtc(date, 'MMMM dd, yyyy') : noneNoted
  return [dateMMddyyyy, dateA11yLabel]
}
