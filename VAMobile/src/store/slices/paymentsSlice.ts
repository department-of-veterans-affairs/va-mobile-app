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

function fakeApi(delay: number, year: string, page: number) {
  const value = getDummyData(year, page)
  return new Promise((resolve) => setTimeout(resolve, delay, value))
}

function getDummyData(year: string, page: number) {
  const Data21 = {
    '1': {
      data: [
        {
          id: '1',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-02-01T00:00:00.000-07:00',
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
            bank: null,
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
        {
          id: '6',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-04-01T00:00:00.000-06:00',
            amount: '$3,271.17',
            payementType: 'Compensation & Pension - Retroactive',
            paymentMethod: 'Paper Check',
            bank: null,
            account: null,
          },
        },
        {
          id: '7',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-05-01T00:00:00.000-06:00',
            amount: '$3,271.17',
            payementType: 'Compensation & Pension - Recurring',
            paymentMethod: 'Direct Deposit',
            bank: 'BANK OF AMERICA, N.A.',
            account: '********0567',
          },
        },
        {
          id: '8',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-06-01T00:00:00.000-06:00',
            amount: '$3,271.17',
            payementType: 'Compensation & Pension - Recurring',
            paymentMethod: 'Direct Deposit',
            bank: 'BANK OF AMERICA, N.A.',
            account: '********0567',
          },
        },
        {
          id: '9',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-07-01T00:00:00.000-06:00',
            amount: '$3,271.17',
            payementType: 'Compensation & Pension - Recurring',
            paymentMethod: 'Direct Deposit',
            bank: 'BANK OF AMERICA, N.A.',
            account: '********0567',
          },
        },
        {
          id: '10',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-08-01T00:00:00.000-06:00',
            amount: '$3,271.17',
            payementType: 'Compensation & Pension - Recurring',
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
          totalEntries: 12,
        },
      },
    },
    '2': {
      data: [
        {
          id: '1',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2021-01-01T00:00:00.000-07:00',
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
            date: '2021-01-01T00:00:00.000-06:00',
            amount: '$1,172.60',
            payementType: 'Post-9/11 GI Bill',
            paymentMethod: 'Direct Deposit',
            bank: 'BANK OF AMERICA, N.A.',
            account: '********0567',
          },
        },
      ],
      meta: {
        pagination: {
          currentPage: 2,
          perPage: 10,
          totalEntries: 12,
        },
      },
    },
  }
  const Data22 = {
    '1': {
      data: [
        {
          id: '1',
          type: 'paymentHistoryInformation',
          attributes: {
            date: '2022-01-01T00:00:00.000-07:00',
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
            date: '2022-01-01T00:00:00.000-06:00',
            amount: '$1,172.60',
            payementType: 'Post-9/11 GI Bill',
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
          totalEntries: 2,
        },
      },
    },
  }
  const dataEmpty = {
    data: [],
  }

  if (year === '2021') {
    if (page === 1) {
      return Data21['1']
    } else if (page === 2) {
      return Data21['2']
    } else {
      return dataEmpty
    }
  } else if (year === '2022') {
    if (page === 1) {
      return Data22['1']
    } else {
      return dataEmpty
    }
  } else {
    return dataEmpty
  }
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
      const paymentsList: any = await fakeApi(3000, year, page)

      dispatch(dispatchFinishGetPayments({ payments: paymentsList, yearAndPage }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetPayments({ error, yearAndPage }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to get a single payment
 */
export const getPayment =
  (appointmentID: string): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchGetPayment(appointmentID))
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
    dispatchGetPayment: (state, action: PayloadAction<string>) => {
      const paymentId = action.payload
      const { paymentsById = {} } = state
      const payment: PaymentsData = paymentsById[paymentId]

      state.payment = payment
    },
  },
})

export const { dispatchFinishGetPayments, dispatchStartGetPayments, dispatchGetPayment } = paymentstSlice.actions
export default paymentstSlice.reducer
