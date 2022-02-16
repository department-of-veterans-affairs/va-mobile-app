import { DemoStore } from './store'
import { Params } from '..'
import { PaymentsGetData } from '../types'
import { getFormattedDate } from 'utils/formattingUtils'

type PaymentsPageNumber = '1' & '2'
type PaymentsYearNumber = '2017' | '2016'

/**
 * Type denoting the demo data store
 */
export type PaymenDemoStore = {
  '/v0/payment-history': {
    '2017': { '1': PaymentsGetData }
    '2016': {
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
  const date = params.startDate || '2017-01-01T00:00:00-05:00'
  const year = getFormattedDate(date.toString(), 'yyyy')
  return store[endpoint as keyof PaymenDemoStore][year as PaymentsYearNumber][page as PaymentsPageNumber] as PaymentsGetData
}
