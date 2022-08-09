import { DemoStore } from './store'
import { Params, PrescriptionTrackingInfoGetData, PrescriptionsGetData } from '..'

type PrescriptionsPageNumber = '1' | '2' | '3'

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
  '/v0/health/rx/prescriptions': {
    '1': PrescriptionsGetData
    '2': PrescriptionsGetData
    '3': PrescriptionsGetData
  }
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
  const page = params['page[number]']
  const prescriptionsStore = store[endpoint as keyof PrescriptionData]

  if (!page) {
    const combinedData = prescriptionsStore['1'].data.concat(prescriptionsStore['2'].data.concat(prescriptionsStore['3'].data))

    return {
      ...prescriptionsStore['1'],
      data: combinedData,
    }
  }
  return store[endpoint as keyof PrescriptionData][page as PrescriptionsPageNumber] as PrescriptionsGetData
}
