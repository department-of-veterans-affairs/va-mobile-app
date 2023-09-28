import { ASCENDING } from '../constants/common'
import { LabelTagTypeConstants } from 'components/LabelTag'
import { PrescriptionSortOptionConstants, PrescriptionSortOptions, RefillStatus, RefillStatusConstants } from 'store/api/types'
import { TFunction } from 'i18next'
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

export const getSortOrderOptionsForSortBy = (sortBy: PrescriptionSortOptions | '', t: TFunction) => {
  switch (sortBy) {
    case PrescriptionSortOptionConstants.FACILITY_NAME:
    case PrescriptionSortOptionConstants.PRESCRIPTION_NAME:
      return [
        {
          value: ASCENDING,
          labelKey: t('prescriptions.sort.atoz'),
          a11yLabel: t('prescriptions.sort.atoz.a11y'),
        },
        {
          value: '',
          labelKey: t('prescriptions.sort.ztoa'),
          a11yLabel: t('prescriptions.sort.ztoa.a11y'),
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
export const getStatusDefinitionTextForRefillStatus = (status: RefillStatus, t: TFunction): { text: string; a11yLabel: string } => {
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
