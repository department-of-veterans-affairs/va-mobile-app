import {
  PrescriptionRefillData,
  PrescriptionTrackingInfoGetData,
  PrescriptionsGetData,
  SingleRefillRequest,
} from 'api/types'
import { DemoStore } from 'store/api/demo/store'
import { Params } from 'store/api/index'

// Union type to handle both v0 and v1 request formats
type RefillRequestParams = {
  ids: string[] | SingleRefillRequest[]
}

/**
 * Types for prescription tracking information
 */
type PrescriptionTrackingInfo = {
  '/v0/health/rx/prescriptions/21142592/tracking': PrescriptionTrackingInfoGetData
  '/v0/health/rx/prescriptions/21142623/tracking': PrescriptionTrackingInfoGetData
}

/**
 * Types for prescription GET data
 */
type PrescriptionData = {
  '/v0/health/rx/prescriptions': PrescriptionsGetData
}

/**
 * Type denoting the demo data store
 */
export type PrescriptionsDemoStore = PrescriptionData & PrescriptionTrackingInfo

/**
 * Type to define the mock returns to keep type safety
 */
export type PrescriptionsDemoReturnTypes =
  | undefined
  | PrescriptionsGetData
  | PrescriptionTrackingInfoGetData
  | PrescriptionRefillData

export const getPrescriptions = (store: DemoStore, params: Params, endpoint: string): PrescriptionsGetData => {
  return store[endpoint as keyof PrescriptionsDemoStore] as PrescriptionsGetData
}

/**
 * Mock function to handle prescription refill requests for both v0 and v1 APIs
 */
export const requestRefill = (store: DemoStore, params: RefillRequestParams): PrescriptionRefillData => {
  let prescriptionIds: string[]
  let stationNumbers: string[] = []

  // Handle both v0 format { ids: string[] } and v1 format { ids: SingleRefillRequest[] }
  if (params.ids && Array.isArray(params.ids)) {
    if (typeof params.ids[0] === 'string') {
      // v0 format: { ids: string[] }
      prescriptionIds = params.ids as string[]
      stationNumbers = ['SLC10', 'DAYT29'] // Default station numbers for v0
    } else {
      // v1 format: { ids: SingleRefillRequest[] }
      const v1Requests = params.ids as SingleRefillRequest[]
      prescriptionIds = v1Requests.map((request) => request.id)
      stationNumbers = [...new Set(v1Requests.map((request) => request.stationNumber))]
    }
  } else {
    prescriptionIds = []
  }

  // Mock successful refill response
  return {
    data: {
      id: 'refill-request',
      type: 'PrescriptionRefill',
      attributes: {
        failedStationList: null,
        successfulStationList: stationNumbers.join(','),
        lastUpdatedTime: new Date().toISOString(),
        prescriptionList: prescriptionIds.join(','),
        failedPrescriptionIds: [],
      },
    },
  }
}
