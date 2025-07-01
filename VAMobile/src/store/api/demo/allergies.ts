import { AllergyListPayload } from 'api/types/AllergyData'
import { DemoStore } from 'store/api/demo/store'
import { Params } from 'store/api/index'

type AllergyPageNumber = '1'

/**
 * Type denoting the demo data store
 */
export type AllergyList = {
  '/v1/health/allergy-intolerances': {
    '1': AllergyListPayload
  }
}

export type AllergyDemoStore = AllergyList

/**
 * Type to define the mock returns to keep type safety
 */
export type AllergyDemoReturnTypes = undefined | AllergyListPayload
export const getAllergyList = (store: DemoStore, params: Params, endpoint: string): AllergyListPayload => {
  const page = params['page[number]']
  return store[endpoint as keyof AllergyList][page as AllergyPageNumber] as AllergyListPayload
}
