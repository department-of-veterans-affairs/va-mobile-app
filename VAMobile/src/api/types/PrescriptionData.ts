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

export type PrescriptionAttributeData = {
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

export type PrescriptionsList = Array<PrescriptionData>

export type PrescriptionData = {
  type: string
  id: string
  attributes: PrescriptionAttributeData
}

export type PrescriptionsGetData = {
  data: PrescriptionsList
  links: PrescriptionsPaginationLinks
  meta: PrescriptionsGetMeta
}

export type PrescriptionsGetMeta = {
  pagination: PrescriptionsPaginationData
  prescriptionStatusCount: PrescriptionStatusCountData
}

export type PrescriptionsPaginationData = {
  currentPage: number
  perPage: number
  totalPages: number
  totalEntries: number
}

export type PrescriptionStatusCountData = {
  active: number
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

export type PrescriptionsPaginationLinks = {
  self: string
  first: string
  prev: string | null
  next: string | null
  last: string
}

export type PrescriptionsMap = {
  [key: string]: PrescriptionData
}

export type RefillRequestSummaryItems = Array<{ submitted: boolean; data: PrescriptionData }>

export type PrescriptionTrackingInfoOtherItem = {
  prescriptionName: string
  prescriptionNumber: string
}

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

export type PrescriptionTrackingInfoAttributeData = {
  prescriptionName: string
  prescriptionNumber: string
  prescriptionId: number
  trackingNumber: string
  ndcNumber: string
  shippedDate: string
  deliveryService: string
  otherPrescriptions: Array<PrescriptionTrackingInfoOtherItem>
}

export type PrescriptionTrackingInfo = {
  type: string
  id: string
  attributes: PrescriptionTrackingInfoAttributeData
}

export type PrescriptionTrackingInfoGetData = {
  data: Array<PrescriptionTrackingInfo>
}

export type PrescriptionRefillAttributeData = {
  failedStationList: string | null
  successfulStationList: string | null
  lastUpdatedTime: string | null
  prescriptionList: string | null
  failedPrescriptionIds: Array<string>
}

export type PrescriptionRefillData = {
  data: {
    id: string
    type: string
    attributes: PrescriptionRefillAttributeData
  }
}
