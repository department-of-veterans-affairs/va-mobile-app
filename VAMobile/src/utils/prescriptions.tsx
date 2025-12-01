import { TFunction } from 'i18next'
import { contains, filter as filterFunction, sortBy } from 'underscore'

import { PrescriptionSortOptionConstants, PrescriptionsList, RefillStatus, RefillStatusConstants } from 'api/types'
import { LabelTagTypeConstants } from 'components/LabelTag'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { formatDateUtc } from 'utils/formattingUtils'

export const getTextForRefillStatus = (
  status: RefillStatus,
  t: TFunction,
  medicationsOracleHealthEnabled: boolean = false,
) => {
  if (!medicationsOracleHealthEnabled) {
    switch (status) {
      case RefillStatusConstants.ACTIVE:
        return t('prescription.history.tag.active')
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
        return t('prescription.history.tag.discontinued')
      case RefillStatusConstants.EXPIRED:
        return t('prescription.history.tag.expired')
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
        return t('prescription.history.tag.active.hold')
      case RefillStatusConstants.ACTIVE_PARKED:
        return t('prescription.history.tag.active.parked')
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return t('prescription.history.tag.active.inProgress')
      case RefillStatusConstants.TRANSFERRED:
        return t('prescription.history.tag.transferred')
      case RefillStatusConstants.SUBMITTED:
        return t('prescription.history.tag.submitted')
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.UNKNOWN:
        return t('prescription.history.tag.statusNotAvailable')
    }
  } else {
    // v1
    switch (status) {
      case RefillStatusConstants.ACTIVE:
      case RefillStatusConstants.ACTIVE_PARKED:
        return t('prescription.history.tag.active')
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
      case RefillStatusConstants.EXPIRED:
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
        return t('prescription.history.tag.inactive')
      case RefillStatusConstants.REFILL_IN_PROCESS:
      case RefillStatusConstants.SUBMITTED:
        return t('prescription.history.tag.active.inProgressv2')
      case RefillStatusConstants.TRANSFERRED:
        return t('prescription.history.tag.transferred')
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.UNKNOWN:
        return t('prescription.history.tag.statusNotAvailable')
    }
  }
}

/**
 * Some filter values from the front end map to multiple values on the back end. This util provides the translation
 * from value selected on the front end to the param sent to the API
 * @param filter - value selected by the user
 */
export const getFilterArgsForFilter = (filter: string) => {
  switch (filter) {
    case RefillStatusConstants.ACTIVE:
      return ['active', 'activeParked', 'hold', 'providerHold', 'refillinprocess', 'submitted']
    case RefillStatusConstants.DISCONTINUED:
      return ['discontinued', 'discontinuedByProvider', 'discontinuedEdit']
  }

  return [filter]
}

export const getTagTypeForStatus = (status: string, medicationsOracleHealthEnabled: boolean = false) => {
  if (!medicationsOracleHealthEnabled) {
    switch (status) {
      case RefillStatusConstants.ACTIVE:
        return LabelTagTypeConstants.tagBlue
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
      case RefillStatusConstants.EXPIRED:
      case RefillStatusConstants.UNKNOWN:
      case RefillStatusConstants.TRANSFERRED:
        return LabelTagTypeConstants.tagInactive
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.ACTIVE_PARKED:
      case RefillStatusConstants.SUBMITTED:
        return LabelTagTypeConstants.tagYellow
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return LabelTagTypeConstants.tagGreen
      default:
        return LabelTagTypeConstants.tagInactive
    }
  } else {
    // v1
    switch (status) {
      case RefillStatusConstants.ACTIVE:
      case RefillStatusConstants.ACTIVE_PARKED:
        return LabelTagTypeConstants.tagBlue
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
      case RefillStatusConstants.EXPIRED:
      case RefillStatusConstants.UNKNOWN:
      case RefillStatusConstants.TRANSFERRED:
        return LabelTagTypeConstants.tagInactive
      case RefillStatusConstants.SUBMITTED:
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return LabelTagTypeConstants.tagGreen
      default:
        return LabelTagTypeConstants.tagInactive
    }
  }
}

/**
 * Function to get the correct text and a11yLabel for a certain type of RefillStatus
 * @param status - RefillStatus to key to pull in the correct text
 * @param t - translation function
 */
export const getStatusDefinitionTextForRefillStatus = (
  status: RefillStatus,
  t: TFunction,
  medicationsOracleHealthEnabled: boolean = false,
): { text: string; a11yLabel: string } => {
  if (!medicationsOracleHealthEnabled) {
    switch (status) {
      case RefillStatusConstants.ACTIVE:
        return {
          text: t('statusDefinition.active'),
          a11yLabel: a11yLabelVA(t('statusDefinition.active')),
        }
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return {
          text: t('statusDefinition.active.inProgress'),
          a11yLabel: a11yLabelVA(t('statusDefinition.active.inProgress')),
        }
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
        return {
          text: t('statusDefinition.active.hold'),
          a11yLabel: a11yLabelVA(t('statusDefinition.active.hold')),
        }
      case RefillStatusConstants.ACTIVE_PARKED:
        return {
          text: t('statusDefinition.active.parked'),
          a11yLabel: a11yLabelVA(t('statusDefinition.active.parked')),
        }
      case RefillStatusConstants.SUBMITTED:
        return {
          text: t('statusDefinition.active.submitted'),
          a11yLabel: a11yLabelVA(t('statusDefinition.active.submitted')),
        }
      case RefillStatusConstants.TRANSFERRED:
        return {
          text: t('statusDefinition.transferred'),
          a11yLabel: a11yLabelVA(t('statusDefinition.transferred')),
        }
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
        return {
          text: t('statusDefinition.discontinued'),
          a11yLabel: a11yLabelVA(t('statusDefinition.discontinued')),
        }
      case RefillStatusConstants.EXPIRED:
        return {
          text: t('statusDefinition.expired'),
          a11yLabel: a11yLabelVA(t('statusDefinition.expired')),
        }
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.UNKNOWN:
        return {
          text: t('statusDefinition.statusNotAvailable'),
          a11yLabel: a11yLabelVA(t('statusDefinition.statusNotAvailable')),
        }
      default:
        return {
          text: '',
          a11yLabel: '',
        }
    }
  } else {
    // v1
    switch (status) {
      case RefillStatusConstants.ACTIVE:
      case RefillStatusConstants.ACTIVE_PARKED:
        return {
          text: t('statusDefinition.activev1'),
          a11yLabel: a11yLabelVA(t('statusDefinition.activev1')),
        }
      case RefillStatusConstants.SUBMITTED:
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return {
          text: t('statusDefinition.active.inProgressv1'),
          a11yLabel: a11yLabelVA(t('statusDefinition.active.inProgressv1')),
        }
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
      case RefillStatusConstants.EXPIRED:
        return {
          text: t('statusDefinition.inactive'),
          a11yLabel: a11yLabelVA(t('statusDefinition.inactive')),
        }
      case RefillStatusConstants.TRANSFERRED:
        return {
          text: t('statusDefinition.transferred'),
          a11yLabel: a11yLabelVA(t('statusDefinition.transferred')),
        }
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.UNKNOWN:
        return {
          text: t('statusDefinition.statusNotAvailable'),
          a11yLabel: a11yLabelVA(t('statusDefinition.statusNotAvailable')),
        }
      default:
        return {
          text: '',
          a11yLabel: '',
        }
    }
  }
}

export const filterAndSortPrescriptions = (
  prescrptions: PrescriptionsList,
  filters: string[],
  sort: string,
  ascending: boolean,
  t: TFunction,
  medicationsOracleHealthEnabled: boolean = false,
): PrescriptionsList => {
  let filteredList: PrescriptionsList = []
  // If there are no filters, don't filter the list
  if (filters[0] === '') {
    filteredList = [...prescrptions]
  } else if (filters[0] === RefillStatusConstants.PENDING) {
    filteredList = filterFunction(prescrptions, (prescription) => {
      return (
        prescription.attributes.refillStatus === RefillStatusConstants.REFILL_IN_PROCESS ||
        prescription.attributes.refillStatus === RefillStatusConstants.SUBMITTED
      )
    })
  } else if (filters[0] === RefillStatusConstants.TRACKING) {
    filteredList = filterFunction(prescrptions, (prescription) => {
      return prescription.attributes.isTrackable
    })
  } else if (filters[0] === RefillStatusConstants.INACTIVE) {
    filteredList = filterFunction(prescrptions, (prescriptions) => {
      return contains(
        [
          RefillStatusConstants.DISCONTINUED,
          RefillStatusConstants.EXPIRED,
          RefillStatusConstants.HOLD,
          RefillStatusConstants.PROVIDER_HOLD,
          RefillStatusConstants.DISCONTINUED_BY_PROVIDER,
          RefillStatusConstants.DISCONTINUED_EDIT,
        ],
        prescriptions.attributes.refillStatus,
      )
    })
  } else {
    // Apply the custom filter by
    filteredList = filterFunction(prescrptions, (prescription) => {
      return contains(filters, prescription.attributes.refillStatus)
    })
  }

  let sortedList: PrescriptionsList = []

  // Sort the list
  switch (sort) {
    case PrescriptionSortOptionConstants.PRESCRIPTION_NAME:
    case PrescriptionSortOptionConstants.REFILL_REMAINING:
      sortedList = sortBy(filteredList, (a) => {
        return a.attributes[sort]
      })
      break
    case PrescriptionSortOptionConstants.REFILL_DATE:
      sortedList = sortBy(filteredList, (a) => {
        return new Date(a.attributes.refillDate || 0)
      })
      break
    case PrescriptionSortOptionConstants.REFILL_STATUS:
      sortedList = sortBy(filteredList, (a) => {
        return getTextForRefillStatus(a.attributes[sort] as RefillStatus, t, medicationsOracleHealthEnabled)
      })
      break
  }

  // For descending order, reverse the list
  if (!ascending) {
    sortedList.reverse()
  }

  return sortedList
}

/**
 * Returns the display text and accessibilityLabel value for rxNumber used in Prescriptions. Defaults to 'None noted' if not given.
 * @param t - translation set with `useTranslation(NAMESPACE.COMMON)`
 * @param prescriptionNumber - number of prescriptions
 * @param missingValueText - text to display if prescriptionNumber is not provided
 *
 * ex. returns [`Rx #: 1231` | `None Noted`, `Rx number 1 2 3 1` | `None Noted`]
 */
export const getRxNumberTextAndLabel = (
  t: TFunction,
  prescriptionNumber?: string,
  missingValueText?: string | null,
) => {
  const noneNoted = missingValueText || t('noneNoted')
  const rxNumber = `${t('prescription.rxNumber')} ${prescriptionNumber || noneNoted}`
  const rxNumberA11yLabel = `${t('prescription.rxNumber.a11yLabel')} ${a11yLabelID(prescriptionNumber) || noneNoted}`
  return [rxNumber, rxNumberA11yLabel]
}

/**
 * Returns the display text and accessibilityLabel value for date used in Prescriptions. Defaults to 'None noted' if not given.
 * @param t - translation set with `useTranslation(NAMESPACE.COMMON)`
 * @param date - date passed in
 * @param missingValueText - text to display if a date is not provided
 *
 * ex. returns ['01/02/2023' | `None Noted`, `January 2nd, 20223` | `None Noted`]
 */
export const getDateTextAndLabel = (t: TFunction, date: string | null, missingValueText?: string | null) => {
  const noneNoted = missingValueText || t('noneNoted')
  const dateMMddyyyy = date ? formatDateUtc(date, 'MM/dd/yyyy') : noneNoted
  const dateA11yLabel = date ? formatDateUtc(date, 'MMMM dd, yyyy') : noneNoted
  return [dateMMddyyyy, dateA11yLabel]
}

// OH Data includes the refills in the instructions text, so we need to remove it
export const removeTrailingRefills = (text: string | null): string => {
  return text?.replace(/\s*Refills?:\s*\d*\.?\s*$/i, '').trim() || ''
}
