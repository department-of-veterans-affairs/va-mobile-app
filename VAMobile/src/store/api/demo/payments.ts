import { DemoStore } from './store'
import { Params } from '..'
import { PaymentAccountData, PaymentsGetData } from '../types'
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

export type PaymentsAccountStore = {
  '/v0/payment-information/benefits': PaymentAccountData
}

/**
 * Type to define the mock returns to keep type safety
 */
export type PaymentsDemoReturnTypes = undefined | PaymentsGetData | PaymentAccountData

export const getPaymentsHistory = (store: DemoStore, params: Params, endpoint: string): PaymentsGetData => {
  const page = params['page[number]'] || '1'
  const year = params.startDate ? getFormattedDate(params.startDate.toString(), 'yyyy') : '2017'
  return store[endpoint as keyof PaymenDemoStore][year as PaymentsYearNumber][page as PaymentsPageNumber] as PaymentsGetData
}

export const getBankData = (store: DemoStore, params: Params, endpoint: string): PaymentAccountData => {
  return store[endpoint as keyof PaymentsAccountStore] as PaymentAccountData
}
