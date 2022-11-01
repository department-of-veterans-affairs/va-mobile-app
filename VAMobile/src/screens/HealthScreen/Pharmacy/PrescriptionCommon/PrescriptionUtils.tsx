import { TFunction } from 'i18next'

import { a11yLabelID } from 'utils/a11yLabel'
import { formatDateUtc } from 'utils/formattingUtils'

/**
 * Returns the display text and accessibilityLabel value for rxNumber used in Prescriptions. Defaults to 'None noted' if not given.
 * @param healthT - translation set with `useTranslation(NAMESPACE.HEALTH)`
 * @param prescriptionNumber - number of prescriptions
 *
 * ex. returns [`Rx #: 1231` | `None Noted`, `Rx number 1 2 3 1` | `None Noted`]
 */
export const getRxNumberTextAndLabel = (healthT: TFunction, prescriptionNumber?: string) => {
  const noneNoted = healthT('common:noneNoted')
  const rxNumber = `${healthT('prescription.rxNumber')} ${prescriptionNumber || noneNoted}`
  const rxNumberA11yLabel = `${healthT('prescription.rxNumber.a11yLabel')} ${a11yLabelID(prescriptionNumber) || noneNoted}`
  return [rxNumber, rxNumberA11yLabel]
}

/**
 * Returns the display text and accessibilityLabel value for date used in Prescriptions. Defaults to 'None noted' if not given.
 * @param healthT - translation set with `useTranslation(NAMESPACE.HEALTH)`
 * @param date - date passed in
 *
 * ex. returns ['01/02/2023' | `None Noted`, `January 2nd, 20223` | `None Noted`]
 */
export const getDateTextAndLabel = (healthT: TFunction, date: string | null) => {
  const noneNoted = healthT('common:noneNoted')
  const dateMMddyyyy = date ? formatDateUtc(date, 'MM/dd/yyyy') : noneNoted
  const dateA11yLabel = date ? formatDateUtc(date, 'MMMM dd, yyyy') : noneNoted
  return [dateMMddyyyy, dateA11yLabel]
}
