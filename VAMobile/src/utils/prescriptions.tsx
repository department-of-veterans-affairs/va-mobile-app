import { PrescriptionHistoryTabConstants, RefillStatus, RefillStatusConstants } from 'store/api/types'
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

/**
 * Some filter values from the front end map to multiple values on the back end. This util provides the translation
 * from value selected on the front end to the param sent to the API
 * @param filter - value selected by the user
 * @param tab - current tab the user is on
 */
export const getFilterArgsForFilterAndTab = (filter: string, tab: string) => {
  let filterResult = filter

  switch (filter) {
    case RefillStatusConstants.DISCONTINUED:
      filterResult = 'discontinued,discontinuedByProvider,discontinuedEdit'
      break
    case RefillStatusConstants.HOLD:
    case RefillStatusConstants.PROVIDER_HOLD:
      filterResult = 'hold,providerHold'
      break
  }

  // The processing tab shows only in process and submitted unless filtered further
  if (tab === PrescriptionHistoryTabConstants.PROCESSING && filter === '') {
    filterResult = 'refillinprocess,submitted'
  }

  return filterResult
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
