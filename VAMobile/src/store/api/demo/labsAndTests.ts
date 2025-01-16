import { LabsAndTestsListPayload } from 'api/types/LabsAndTestsData'

import { Params } from '..'
import { DemoStore } from './store'

type LabsAndTestsPageNumber = '1'

/**
 * Type denoting the demo data store
 */
export type LabsAndTestsList = {
  '/v1/health/allergy-intolerances': {
    '1': LabsAndTestsListPayload
  }
}

export type LabsAndTestsDemoStore = LabsAndTestsList

/**
 * Type to define the mock returns to keep type safety
 */
export type LabsAndTestsDemoReturnTypes = undefined | LabsAndTestsListPayload

export const getLabsAndTestsList = (store: DemoStore, params: Params, endpoint: string): LabsAndTestsListPayload => {
  const page = params['page[number]']
  return store[endpoint as keyof LabsAndTestsList][page as LabsAndTestsPageNumber] as LabsAndTestsListPayload
}
