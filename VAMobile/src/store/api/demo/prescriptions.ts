import { DemoStore } from './store'
import { Params, PrescriptionTrackingInfoGetData, PrescriptionsGetData } from '..'

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
export type PrescriptionsDemoReturnTypes = undefined | PrescriptionsGetData | PrescriptionTrackingInfoGetData

export const getPrescriptions = (store: DemoStore, params: Params, endpoint: string): PrescriptionsGetData => {
  return store[endpoint as keyof PrescriptionsDemoStore] as PrescriptionsGetData
}
