import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from 'store'
import { LoadedPayments, PaymentsByDate, PaymentsData, PaymentsGetData, PaymentsMap, PaymentsMetaPagination, PaymentsPaginationByYearAndPage, ScreenIDTypes } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getLoadedPayments, groupPaymentsByDate, mapPaymentsById } from 'utils/payments'
import { isErrorObject } from 'utils/common'

export type PaymentState = {
  payment?: PaymentsData
  error?: Error
  loading: boolean
  paymentsById: PaymentsMap
  currentPagePayments: PaymentsByDate
  loadedPaymentsByYear: LoadedPayments
  paginationByYearAndPage: PaymentsPaginationByYearAndPage
  currentPagePagination: PaymentsMetaPagination
}

const initialPaginationState = {
  currentPage: 1,
  totalEntries: 0,
  perPage: 0,
}

export const initialPaymentsState: PaymentState = {
  loading: false,
  paymentsById: {} as PaymentsMap,
  currentPagePayments: {} as PaymentsByDate,
  loadedPaymentsByYear: {} as LoadedPayments,
  paginationByYearAndPage: {} as PaymentsPaginationByYearAndPage,
  currentPagePagination: initialPaginationState,
}

function later(delay: number, value: PaymentsGetData) {
  return new Promise((resolve) => setTimeout(resolve, delay, value))
}

/**
 * Redux action to get the users payment history
 */
export const getPayments =
  (year: string, page: number, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getPayments(year, page, screenID))))
    dispatch(dispatchStartGetPayments())
    const yearAndPage = `${year}-${page}`

    const paymentsState = getState().payments
    // get stored list of payments
    const { loadedPaymentsByYear, paginationByYearAndPage: paginationByYear } = paymentsState

    const loadedPayments = getLoadedPayments(loadedPaymentsByYear, paginationByYear, yearAndPage)

    if (loadedPayments) {
      dispatch(dispatchFinishGetPayments({ payments: loadedPayments, yearAndPage }))
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentsList: any = await later(3000, {
        data: [
          {
            id: '1',
            type: 'paymentHistoryInformation',
            attributes: {
              date: '2021-02-01T00:00:00.000-06:00',
              amount: '$3,746.20',
              payementType: 'Compensation & Pension - Recurring',
              paymentMethod: 'Direct Deposit',
              bank: 'BANK OF AMERICA, N.A.',
              account: '********0567',
            },
          },
          {
            id: '2',
            type: 'paymentHistoryInformation',
            attributes: {
              date: '2021-02-01T00:00:00.000-06:00',
              amount: '$1,172.60',
              payementType: 'Post-9/11 GI Bill',
              paymentMethod: 'Direct Deposit',
              bank: 'BANK OF AMERICA, N.A.',
              account: '********0567',
            },
          },
          {
            id: '3',
            type: 'paymentHistoryInformation',
            attributes: {
              date: '2021-03-01T00:00:00.000-06:00',
              amount: '$3,746.20',
              payementType: 'Compensation & Pension - Recurring',
              paymentMethod: 'Direct Deposit',
              bank: 'BANK OF AMERICA, N.A.',
              account: '********0567',
            },
          },
          {
            id: '4',
            type: 'paymentHistoryInformation',
            attributes: {
              date: '2021-03-13T00:00:00.000-06:00',
              amount: '$7,045.00',
              payementType: 'Post 9/11 GI Bill Payment to School',
              paymentMethod: 'Direct Deposit',
              bank: 'null',
              account: '*************    ',
            },
          },
          {
            id: '5',
            type: 'paymentHistoryInformation',
            attributes: {
              date: '2021-03-30T00:00:00.000-06:00',
              amount: '$1,271.17',
              payementType: 'Compensation & Pension - Retroactive',
              paymentMethod: 'Direct Deposit',
              bank: 'BANK OF AMERICA, N.A.',
              account: '********0567',
            },
          },
        ],
        meta: {
          pagination: {
            currentPage: 1,
            perPage: 10,
            totalEntries: 5,
          },
          dataFromStore: false,
        },
      })

      dispatch(dispatchFinishGetPayments({ payments: paymentsList, yearAndPage }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetPayments({ error, yearAndPage }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const paymentstSlice = createSlice({
  name: 'payments',
  initialState: initialPaymentsState,
  reducers: {
    dispatchStartGetPayments: (state) => {
      state.loading = true
    },

    dispatchFinishGetPayments: (state, action: PayloadAction<{ yearAndPage: string; payments?: PaymentsGetData; error?: Error }>) => {
      const { payments, yearAndPage, error } = action.payload
      const paymentsData = payments?.data || []
      const paymentsByDate: PaymentsByDate = groupPaymentsByDate(paymentsData)
      const paymentsMap: PaymentsMap = mapPaymentsById(paymentsData)
      const currPaymentsList = state.loadedPaymentsByYear[yearAndPage]

      state.paymentsById = paymentsMap
      state.currentPagePayments = paymentsByDate
      state.currentPagePagination = payments?.meta.pagination || initialPaginationState
      state.loadedPaymentsByYear[yearAndPage] = payments?.meta?.dataFromStore ? currPaymentsList : paymentsData
      state.paginationByYearAndPage[yearAndPage] = payments?.meta?.pagination || initialPaginationState
      state.error = error
      state.loading = false
    },
  },
})

export const { dispatchFinishGetPayments, dispatchStartGetPayments } = paymentstSlice.actions
export default paymentstSlice.reducer
