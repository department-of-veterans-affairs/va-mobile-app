import { ASCENDING } from '../constants/common'
import { PrescriptionSortOptionConstants, PrescriptionSortOptions, RefillStatus, RefillStatusConstants } from 'store/api/types'
import { TFunction } from 'i18next'

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
    case RefillStatusConstants.SUSPENDED:
      return t('prescription.history.tag.active.suspended')
    case RefillStatusConstants.ACTIVE_PARKED:
      return t('prescription.history.tag.active.parked')
    case RefillStatusConstants.REFILL_IN_PROCESS:
      return t('prescription.history.tag.active.inProgress')
    case RefillStatusConstants.NON_VERIFIED:
      return t('prescription.history.tag.nonVerified')
    case RefillStatusConstants.TRANSFERRED:
      return t('prescription.history.tag.transferred')
    case RefillStatusConstants.SUBMITTED:
      return t('prescription.history.tag.submitted')
    case RefillStatusConstants.DELETED:
    case RefillStatusConstants.UNKNOWN:
      return t('prescription.history.tag.unknown')
  }
}

export const getSortOrderOptionsForSortBy = (sortBy: PrescriptionSortOptions | '', t: TFunction) => {
  switch (sortBy) {
    case PrescriptionSortOptionConstants.FACILITY_NAME:
    case PrescriptionSortOptionConstants.PRESCRIPTION_NAME:
      return [
        {
          value: ASCENDING,
          labelKey: t('prescriptions.sort.atoz'),
        },
        {
          value: '',
          labelKey: t('prescriptions.sort.ztoa'),
        },
      ]
    case PrescriptionSortOptionConstants.REFILL_DATE:
      return [
        {
          value: ASCENDING,
          labelKey: t('prescriptions.sort.old.oldToNew'),
        },
        {
          value: '',
          labelKey: t('prescriptions.sort.old.newToOld'),
        },
      ]
    case PrescriptionSortOptionConstants.REFILL_REMAINING:
      return [
        {
          value: '',
          labelKey: t('prescriptions.sort.low.highToLow'),
        },
        {
          value: ASCENDING,
          labelKey: t('prescriptions.sort.low.lowToHigh'),
        },
      ]
  }

  return []
}

/**
 * Some filter values from the front end map to multiple values on the back end. This util provides the translation
 * from value selected on the front end to the param sent to the API
 * @param filter - value selected by the user
 */
export const getFilterArgsForFilter = (filter: string) => {
  switch (filter) {
    case RefillStatusConstants.DISCONTINUED:
      return ['discontinued', 'discontinuedByProvider', 'discontinuedEdit']
    case RefillStatusConstants.HOLD:
    case RefillStatusConstants.PROVIDER_HOLD:
      return ['hold', 'providerHold']
  }

  return [filter]
}

export const getTagColorForStatus = (status: string) => {
  switch (status) {
    case RefillStatusConstants.ACTIVE:
      return 'tagActive'
    case RefillStatusConstants.DELETED:
    case RefillStatusConstants.DISCONTINUED:
    case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
    case RefillStatusConstants.DISCONTINUED_EDIT:
    case RefillStatusConstants.EXPIRED:
    case RefillStatusConstants.UNKNOWN:
    case RefillStatusConstants.TRANSFERRED:
      return 'tagExpired'
    case RefillStatusConstants.HOLD:
    case RefillStatusConstants.PROVIDER_HOLD:
    case RefillStatusConstants.SUSPENDED:
    case RefillStatusConstants.ACTIVE_PARKED:
    case RefillStatusConstants.NON_VERIFIED:
    case RefillStatusConstants.SUBMITTED:
      return 'tagSuspended'
    case RefillStatusConstants.REFILL_IN_PROCESS:
      return 'tagInProgress'
  }
}

/**
 * Function to get the correct text and a11yLabel for a certain type of RefillStatus
 * @param status - RefillStatus to key to pull in the correct text
 * @param t - translation function
 */
export const getStatusGlossaryTextForRefillStatus = (status: RefillStatus, t: TFunction): { text: string; a11yLabel: string } => {
  switch (status) {
    case RefillStatusConstants.ACTIVE:
      return {
        text: t('statusGlossary.active'),
        a11yLabel: t('statusGlossary.active.a11yLabel'),
      }
    case RefillStatusConstants.REFILL_IN_PROCESS:
      return {
        text: t('statusGlossary.active.inProgress'),
        a11yLabel: t('statusGlossary.active.inProgress.a11yLabel'),
      }
    case RefillStatusConstants.HOLD:
    case RefillStatusConstants.PROVIDER_HOLD:
      return {
        text: t('statusGlossary.active.hold'),
        a11yLabel: t('statusGlossary.active.hold.a11yLabel'),
      }
    case RefillStatusConstants.ACTIVE_PARKED:
      return {
        text: t('statusGlossary.active.parked'),
        a11yLabel: t('statusGlossary.active.parked.a11yLabel'),
      }
    case RefillStatusConstants.SUBMITTED:
      return {
        text: t('statusGlossary.active.submitted'),
        a11yLabel: t('statusGlossary.active.submitted.a11yLabel'),
      }
    case RefillStatusConstants.SUSPENDED:
      return {
        text: t('statusGlossary.active.suspended'),
        a11yLabel: t('statusGlossary.active.suspended.a11yLabel'),
      }
    default:
      return {
        text: '',
        a11yLabel: '',
      }
  }
}
