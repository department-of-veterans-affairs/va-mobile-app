import { VaccineListPayload, VaccineLocationPayload } from 'api/types/VaccineData'

import { Params } from '..'
import { DemoStore } from './store'

type VaccinePageNumber = '1'

/**
 * Type denoting the demo data store
 */
export type VaccineList = {
  '/v1/health/immunizations': {
    '1': VaccineListPayload
  }
}

export type VaccineDemoStore = {
  '/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000': VaccineLocationPayload
  '/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000': VaccineLocationPayload
} & VaccineList

/**
 * Type to define the mock returns to keep type safety
 */
export type VaccineDemoReturnTypes = undefined | VaccineListPayload | VaccineLocationPayload

export const getVaccineList = (store: DemoStore, params: Params, endpoint: string): VaccineListPayload => {
  const page = params['page[number]']
  return store[endpoint as keyof VaccineList][page as VaccinePageNumber] as VaccineListPayload
}
