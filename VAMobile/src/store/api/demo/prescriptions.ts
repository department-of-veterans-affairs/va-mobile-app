import { DemoStore } from './store'
import { Params, PrescriptionsGetData } from '..'

/**
 * Type denoting the demo data store
 */
export type PrescriptionsDemoStore = {
  '/v0/health/rx/prescriptions': PrescriptionsGetData
}

/**
 * Type to define the mock returns to keep type safety
 */
export type PrescriptionsDemoReturnTypes = undefined | PrescriptionsGetData

export const getPrescriptions = (store: DemoStore, params: Params, endpoint: string): PrescriptionsGetData => {
  return store[endpoint as keyof PrescriptionsDemoStore] as PrescriptionsGetData
}
