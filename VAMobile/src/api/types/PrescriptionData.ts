import { AppointmentPhone } from 'api/types'

export type PrescriptionSortOptions = 'refillDate' | 'prescriptionName' | 'refillRemaining' | 'refillStatus'

export const PrescriptionSortOptionConstants: {
  REFILL_DATE: PrescriptionSortOptions
  PRESCRIPTION_NAME: PrescriptionSortOptions
  REFILL_REMAINING: PrescriptionSortOptions
  REFILL_STATUS: PrescriptionSortOptions
} = {
  REFILL_DATE: 'refillDate',
  PRESCRIPTION_NAME: 'prescriptionName',
  REFILL_REMAINING: 'refillRemaining',
  REFILL_STATUS: 'refillStatus',
}

export const RefillStatusConstants: {
  ACTIVE: RefillStatus
  INACTIVE: RefillStatus
  DELETED: RefillStatus
  DISCONTINUED: RefillStatus
  DISCONTINUED_BY_PROVIDER: RefillStatus
  DISCONTINUED_EDIT: RefillStatus
  EXPIRED: RefillStatus
  HOLD: RefillStatus
  PENDING: RefillStatus
  PROVIDER_HOLD: RefillStatus
  REFILL_IN_PROCESS: RefillStatus
  UNKNOWN: RefillStatus
  ACTIVE_PARKED: RefillStatus
  TRACKING: RefillStatus
  TRANSFERRED: RefillStatus
  SUBMITTED: RefillStatus
} = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
  DISCONTINUED: 'discontinued',
  DISCONTINUED_BY_PROVIDER: 'discontinuedByProvider',
  DISCONTINUED_EDIT: 'discontinuedEdit',
  EXPIRED: 'expired',
  HOLD: 'hold',
  PENDING: 'pending',
  PROVIDER_HOLD: 'providerHold',
  REFILL_IN_PROCESS: 'refillinprocess',
  UNKNOWN: 'unknown',
  ACTIVE_PARKED: 'activeParked',
  TRACKING: 'tracking',
  TRANSFERRED: 'transferred',
  SUBMITTED: 'submitted',
}

export type RefillStatus =
  | 'active'
  | 'inactive'
  | 'deleted'
  | 'discontinued'
  | 'discontinuedByProvider'
  | 'discontinuedEdit'
  | 'expired'
  | 'hold'
  | 'pending'
  | 'providerHold'
  | 'refillinprocess'
  | 'unknown'
  | 'activeParked'
  | 'tracking'
  | 'transferred'
  | 'submitted'
  | 'dateOfDeathEntered'

export const DELIVERY_SERVICE_TYPES: {
  USPS: string
  UPS: string
  FEDEX: string
  DHL: string
} = {
  USPS: 'USPS',
  UPS: 'UPS',
  FEDEX: 'FEDEX',
  DHL: 'DHL',
}

// API Responses Types

// Shared Types GET ALL
export type PrescriptionAttributeDataBase = {
  refillStatus: RefillStatus
  refillSubmitDate: string | null
  refillDate: string | null
  refillRemaining: number
  facilityName: string
  facilityPhoneNumber: string | AppointmentPhone | undefined
  isRefillable: boolean
  isTrackable: boolean
  orderedDate: string | null
  quantity: number
  expirationDate: string | null
  prescriptionNumber: string
  prescriptionName: string
  instructions: string | null
  dispensedDate: string | null
  stationNumber: string
}

export type PrescriptionAttributeDataBasev1 = {
  refillStatus: RefillStatus
  refillSubmitDate: string | null
  refillDate: string | null
  refillRemaining: number
  facilityName: string | null
  facilityPhoneNumber: string | AppointmentPhone | undefined | null
  isRefillable: boolean
  isTrackable: boolean
  orderedDate: string | null
  quantity: number
  expirationDate: string | null
  prescriptionNumber: string
  prescriptionName: string
  instructions: string | null
  dispensedDate: string | null
  stationNumber: string | null
  type: string | null
  prescriptionSource: string | null
  cmopDivisionPhone: string | null
  cmopNdcNumber: string | null
  remarks: string | null
  dispStatus: string | null
}

// request meta data
export type PrescriptionsGetData = {
  data: PrescriptionsList
  links: PrescriptionsPaginationLinks
  meta: PrescriptionsGetMeta
}

export type PrescriptionsPaginationLinks = {
  self: string
  first: string
  prev: string | null
  next: string | null
  last: string
}

export type PrescriptionsGetMeta = {
  pagination: PrescriptionsPaginationData
  prescriptionStatusCount: PrescriptionStatusCountData
  hasNonVaMeds: boolean
}

export type PrescriptionStatusCountData = {
  active: number
  inactive: number
  isRefillable: number
  discontinued: number
  expired: number
  historical: number
  pending: number
  transferred: number
  submitted: number
  hold: number
  unknown: number
  total: number
}

export type PrescriptionsPaginationData = {
  currentPage: number
  perPage: number
  totalPages: number
  totalEntries: number
}

export type PrescriptionsList = Array<PrescriptionData>

export type PrescriptionData = {
  type: string
  id: string
  attributes: PrescriptionAttributeData | PrescriptionsAttributeDataV1
}
// Tracking Status

export type PrescriptionTrackingItemV0 = {
  prescriptionName: string
  prescriptionNumber: string
  ndcNumber: string
  prescriptionId: number
  trackingNumber: string
  shippedDate: string
  deliveryService?: string
  otherPrescriptions: Array<PrescriptionTrackingInfoOtherItem>
}

export type PrescriptionTrackingItemV1 = {
  prescriptionName: string
  prescriptionNumber: string
  ndcNumber: string
  prescriptionId: number
  trackingNumber: string
  shippedDate: string
  carrier?: string
  otherPrescriptions: Array<PrescriptionTrackingInfoOtherItem>
}

export type PrescriptionTrackingInfoOtherItem = {
  prescriptionName: string
  prescriptionNumber: string
  ndcNumber?: string
  stationNumber?: string
}

export type PrescriptionTrackingItem = PrescriptionTrackingItemV0 & PrescriptionTrackingItemV1

// GET all Rx

// v0 response api structure
export type PrescriptionAttributeData = PrescriptionAttributeDataBase

// v1 response api structure
export type PrescriptionsAttributeDataV1 = PrescriptionAttributeDataBasev1 & {
  tracking?: Array<PrescriptionTrackingItem> | null
}

// v0 refill request api structure

export type RefillRequestDataV0 = {
  ids: string[]
}

// v1 refill request api structure

export type SingleRefillRequest = {
  stationNumber: string
  id: string
}

export type RefillRequestDataV1 = Array<SingleRefillRequest>

export type RefillRequestData = RefillRequestDataV0 | RefillRequestDataV1

// v0&v1 refill response api structure
export type RefillResponsePrescriptionListItem = {
  id: string
  stationNumber: string
  status: string
}

export type PrescriptionRefillError = {
  developerMessage: string
  prescriptionId: string
  stationNumber: string
}

export type PrescriptionRefillInfoMessage = {
  prescriptionId: string
  message: string
  stationNumber: string
}

export type PrescriptionRefillData = {
  data: {
    id: string
    type: string
    attributes: PrescriptionRefillAttributeDataV0 | PrescriptionRefillAttributeDataV1
  }
}

export type PrescriptionRefillAttributeDataV0 = {
  failedStationList: string | string[] | null
  successfulStationList: string | string[] | null
  lastUpdatedTime: string | null
  prescriptionList: string | RefillResponsePrescriptionListItem[] | null
  failedPrescriptionIds: Array<string>
  errors: PrescriptionRefillError[]
  infoMessages: PrescriptionRefillInfoMessage[]
}

export type PrescriptionRefillAttributeDataV1 = {
  failedStationList: string | string[] | null
  successfulStationList: string | string[] | null
  lastUpdatedTime: string | null
  prescriptionList: string | RefillResponsePrescriptionListItem[] | null
  failedPrescriptionIds: Array<{ id: string; stationNumber: string }>
  errors: PrescriptionRefillError[]
  infoMessages: PrescriptionRefillInfoMessage[]
}

export type PrescriptionRefillAttributeData = PrescriptionRefillAttributeDataV0 | PrescriptionRefillAttributeDataV1

export type RefillRequestSummaryItems = Array<{ submitted: boolean; data: PrescriptionData }>

// v0 tracking api, no v1 API
export type PrescriptionTrackingInfo = {
  type: string
  id: string
  attributes: PrescriptionTrackingItem
}

export type PrescriptionTrackingInfoGetData = {
  data: Array<PrescriptionTrackingInfo>
}
