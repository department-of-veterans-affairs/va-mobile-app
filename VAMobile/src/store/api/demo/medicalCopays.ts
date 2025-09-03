import { MedicalCopayPayload, MedicalCopaysPayload } from 'api/types'
import { Params } from 'store/api'
import { DemoStore } from 'store/api/demo/store'

/**
 * Demo data store shape for medical copays.
 */
export type MedicalCopaysDemoStore = {
  '/v0/medical_copays': MedicalCopaysPayload
}

/** Union of return types for copay demo API calls */
export type MedicalCopaysDemoReturnTypes = undefined | MedicalCopaysPayload | MedicalCopayPayload

/** GET /v0/medical_copays */
export const getMedicalCopays = (store: DemoStore, _params: Params, endpoint: string): MedicalCopaysPayload => {
  return store[endpoint as keyof MedicalCopaysDemoStore] as MedicalCopaysPayload
}
