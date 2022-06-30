import { RefillStatus, RefillStatusConstants } from 'store/api/types'
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
