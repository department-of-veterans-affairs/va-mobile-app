import { DemoStore } from './store'
import { Params, PrescriptionsGetData } from '..'

type PrescriptionsPageNumber = '1' | '2'

/**
 * Type denoting the demo data store
 */
export type PrescriptionsDemoStore = {
  '/v0/health/rx/prescriptions': {
    '1': PrescriptionsGetData
    '2': PrescriptionsGetData
  }
}

/**
 * Type to define the mock returns to keep type safety
 */
export type PrescriptionsDemoReturnTypes = undefined | PrescriptionsGetData

export const getPrescriptions = (store: DemoStore, params: Params, endpoint: string): PrescriptionsGetData => {
  const page = params['page[number]']
  // TODO: Fix this workaround
  // const prescriptionsStore = store[endpoint as keyof PrescriptionsDemoStore]
  const prescriptionsStore = store['/v0/health/rx/prescriptions']

  if (!page) {
    const combinedData = prescriptionsStore['1'].data.concat(prescriptionsStore['2'].data)

    return {
      ...prescriptionsStore['1'],
      data: combinedData,
    }
  }
  return store[endpoint as keyof PrescriptionsDemoStore][page as PrescriptionsPageNumber] as PrescriptionsGetData
}
