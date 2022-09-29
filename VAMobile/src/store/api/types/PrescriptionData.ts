export type PrescriptionSortOptions = 'facilityName' | 'refillDate' | 'prescriptionName' | 'refillRemaining'

export const PrescriptionSortOptionConstants: {
  FACILITY_NAME: PrescriptionSortOptions
  REFILL_DATE: PrescriptionSortOptions
  PRESCRIPTION_NAME: PrescriptionSortOptions
  REFILL_REMAINING: PrescriptionSortOptions
} = {
  FACILITY_NAME: 'facilityName',
  REFILL_DATE: 'refillDate',
  PRESCRIPTION_NAME: 'prescriptionName',
  REFILL_REMAINING: 'refillRemaining',
}

export type PrescriptionHistoryTabs = '0' | '1' | '2'

export const PrescriptionHistoryTabConstants: {
  ALL: PrescriptionHistoryTabs
  PENDING: PrescriptionHistoryTabs
  TRACKING: PrescriptionHistoryTabs
} = {
  ALL: '0',
  PENDING: '1',
  TRACKING: '2',
}

export const RefillStatusConstants: {
  ACTIVE: RefillStatus
  DELETED: RefillStatus
  DISCONTINUED: RefillStatus
  DISCONTINUED_BY_PROVIDER: RefillStatus
  DISCONTINUED_EDIT: RefillStatus
  EXPIRED: RefillStatus
  HOLD: RefillStatus
  NON_VERIFIED: RefillStatus
  PROVIDER_HOLD: RefillStatus
  REFILL_IN_PROCESS: RefillStatus
  SUSPENDED: RefillStatus
  UNKNOWN: RefillStatus
  ACTIVE_PARKED: RefillStatus
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
  NON_VERIFIED: 'nonVerified',
  PROVIDER_HOLD: 'providerHold',
  REFILL_IN_PROCESS: 'refillinprocess',
  SUSPENDED: 'suspended',
  UNKNOWN: 'unknown',
  ACTIVE_PARKED: 'activeParked',
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
  | 'nonVerified'
  | 'providerHold'
  | 'refillinprocess'
  | 'suspended'
  | 'unknown'
  | 'activeParked'
  | 'transferred'
  | 'submitted'
  | 'dateOfDeathEntered'

export type PrescriptionAttributeData = {
  refillStatus: RefillStatus
  refillSubmitDate: string | null
  refillDate: string | null
  refillRemaining: number
  facilityName: string
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
}

export type PrescriptionsPaginationData = {
  currentPage: number
  perPage: number
  totalPages: number
  totalEntries: number
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

export type TabCounts = {
  [key: string]: number | undefined
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
  trackingNumber: string
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
  data: PrescriptionTrackingInfo
}
