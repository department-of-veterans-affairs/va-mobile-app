import { VaccineListPayload } from 'api/types/VaccineData'
import { Params } from 'store/api/api'
import { DemoStore } from 'store/api/demo/store'

type VaccinePageNumber = '1'

/**
 * Type denoting the demo data store
 */
export type VaccineList = {
  '/v1/health/immunizations': {
    '1': VaccineListPayload
  }
}

export type VaccineDemoStore = VaccineList

/**
 * Type to define the mock returns to keep type safety
 */
export type VaccineDemoReturnTypes = undefined | VaccineListPayload

export const getVaccineList = (store: DemoStore, params: Params, endpoint: string): VaccineListPayload => {
  const page = params['page[number]']
  return store[endpoint as keyof VaccineList][page as VaccinePageNumber] as VaccineListPayload
}
