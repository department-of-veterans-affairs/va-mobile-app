import {
  PrescriptionRefillAttributeData,
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
  const failedPrescriptionIds: Array<string> | Array<{ id: string; stationNumber: string }> = []
  // Handle both v0 format { ids: string[] } and v1 format { ids: SingleRefillRequest[] }
  if (params && Array.isArray(params) && params.length > 0) {
    if (typeof params[0] === 'string') {
      // v0 format: { ids: string[] }
      prescriptionIds = params as string[]
      stationNumbers = ['SLC10', 'DAYT29'] // Default station numbers for v0
    } else {
      // [
      // success: {"id": "21142579", "stationNumber": "979"},
      // fail: {"id": "21142625", "stationNumber": "989"}
      // ]
      return {
        data: {
          id: '775f2f68-132c-4548-ae7c-ad8e1f5d9fff',
          type: 'PrescriptionRefills',
          attributes: {
            failedStationList: ['556'],
            successfulStationList: ['556'],
            lastUpdatedTime: '2025-09-30T22:04:58Z',
            prescriptionList: [
              {
                id: '21142579',
                status: 'Already in Queue',
                stationNumber: '979',
              },
            ],
            failedPrescriptionIds: [
              {
                id: '21142625',
                stationNumber: '989',
              },
            ],
            errors: [
              {
                developerMessage: '^ER:Error:',
                prescriptionId: '21142625',
                stationNumber: '989',
              },
            ],
            infoMessages: [
              {
                prescriptionId: '21142579',
                message: 'Already in Queue',
                stationNumber: '979',
              },
            ],
          },
        },
      }
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
        failedPrescriptionIds,
        errors: [],
        infoMessages: [],
      } as PrescriptionRefillAttributeData,
    },
  }
}
