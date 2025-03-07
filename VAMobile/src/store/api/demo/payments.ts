import { PaymentsGetData } from 'api/types'
import { getFormattedDate } from 'utils/formattingUtils'

import { Params } from '..'
import { DemoStore } from './store'

type PaymentsPageNumber = '1' & '2'
type PaymentsYearNumber = '2024' | '2023'

/**
 * Type denoting the demo data store
 */
export type PaymenDemoStore = {
  '/v0/payment-history': {
    '2024': { '1': PaymentsGetData }
    '2023': {
      '1': PaymentsGetData
      '2': PaymentsGetData
    }
  }
}

/**
 * Type to define the mock returns to keep type safety
 */
export type PaymentsDemoReturnTypes = undefined | PaymentsGetData

export const getPaymentsHistory = (store: DemoStore, params: Params, endpoint: string): PaymentsGetData => {
  const page = params['page[number]'] || '1'
  const year = params.startDate ? getFormattedDate(params.startDate.toString(), 'yyyy') : '2024'
  return store[endpoint as keyof PaymenDemoStore][year as PaymentsYearNumber][
    page as PaymentsPageNumber
  ] as PaymentsGetData
}
