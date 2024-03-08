import { TFunction } from 'i18next'
import { contains, filter as filterFunction, sortBy } from 'underscore'

import { PrescriptionSortOptionConstants, PrescriptionsList, RefillStatus, RefillStatusConstants } from 'api/types'
import { LabelTagTypeConstants } from 'components/LabelTag'

import { a11yLabelVA } from './a11yLabel'

export const getTextForRefillStatus = (status: RefillStatus, t: TFunction) => {
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
      return t('prescription.history.tag.unknown')
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

export const getTagTypeForStatus = (status: string) => {
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
}

/**
 * Function to get the correct text and a11yLabel for a certain type of RefillStatus
 * @param status - RefillStatus to key to pull in the correct text
 * @param t - translation function
 */
export const getStatusDefinitionTextForRefillStatus = (
  status: RefillStatus,
  t: TFunction,
): { text: string; a11yLabel: string } => {
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
        text: t('statusDefinition.unknown'),
        a11yLabel: a11yLabelVA(t('statusDefinition.unknown')),
      }
    default:
      return {
        text: '',
        a11yLabel: '',
      }
  }
}

export const filterAndSortPrescriptions = (
  prescrptions: PrescriptionsList,
  filters: string[],
  sort: string,
  ascending: boolean,
  t: TFunction,
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
        return getTextForRefillStatus(a.attributes[sort] as RefillStatus, t)
      })
      break
  }

  // For descending order, reverse the list
  if (!ascending) {
    sortedList.reverse()
  }

  return sortedList
}
