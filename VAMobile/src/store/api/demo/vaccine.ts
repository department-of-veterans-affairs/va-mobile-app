import { DemoStore } from './store'
import { Params } from '..'
import { VaccineListData, VaccineLocationData } from '../types'

type VaccinePageNumber = '1' | '2'

/**
 * Type denoting the demo data store
 */
export type VaccineList = {
  '/v1/health/immunizations': {
    '1': VaccineListData
    '2': VaccineListData
  }
}

export type VaccineDemoStore = {
  '/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000': VaccineLocationData
  '/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000': VaccineLocationData
} & VaccineList

/**
 * Type to define the mock returns to keep type safety
 */
export type VaccineDemoReturnTypes = undefined | VaccineListData | VaccineLocationData

export const getVaccineList = (store: DemoStore, params: Params, endpoint: string): VaccineListData => {
  const page = params['page[number]']
  return store[endpoint as keyof VaccineList][page as VaccinePageNumber] as VaccineListData
}
