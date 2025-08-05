import { LabsAndTestsListPayload } from 'api/types/LabsAndTestsData'
import { DemoStore } from 'store/api/demo/store'
import { Params } from 'store/api/index'

/**
 * Type denoting the demo data store
 */
export type LabsAndTestsList = {
  '/v1/health/labs-and-tests': {
    '2024': {
      '1': LabsAndTestsListPayload
      '12': LabsAndTestsListPayload
    }
    '2023': {
      '2': LabsAndTestsListPayload
      '10': LabsAndTestsListPayload
    }
    DEFAULT: LabsAndTestsListPayload
  }
}

export type LabsAndTestsDemoStore = LabsAndTestsList

/**
 * Type to define the mock returns to keep type safety
 */
export type LabsAndTestsDemoReturnTypes = undefined | LabsAndTestsListPayload

export const getLabsAndTestsList = (store: DemoStore, params: Params): LabsAndTestsListPayload => {
  const endDate = new Date(params.endDate.toString())
  const month = endDate.getMonth() + 1
  const year = endDate.getFullYear()

  if (month === 1 && year === 2024) {
    return store['/v1/health/labs-and-tests']['2024']['1']
  } else if (month === 12 && year === 2024) {
    return store['/v1/health/labs-and-tests']['2024']['12']
  } else if (month === 2 && year === 2023) {
    return store['/v1/health/labs-and-tests']['2023']['2']
  } else if (month === 10 && year === 2023) {
    return store['/v1/health/labs-and-tests']['2023']['10']
  } else {
    return store['/v1/health/labs-and-tests'].DEFAULT
  }
}
