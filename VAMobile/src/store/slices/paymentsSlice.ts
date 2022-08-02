import * as api from 'store/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from 'store'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import {
  LoadedPayments,
  Params,
  PaymentsByDate,
  PaymentsData,
  PaymentsGetData,
  PaymentsMap,
  PaymentsMetaPagination,
  PaymentsPaginationByYearAndPage,
  ScreenIDTypes,
} from 'store/api'
import { createYearAndPageString, getFirstAndLastDayOfYear, getLoadedPayments, groupPaymentsByDate, mapPaymentsById } from 'utils/payments'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

export type PaymentState = {
  payment?: PaymentsData
  error?: Error
  loading: boolean
  paymentsById: PaymentsMap
  currentPagePayments: PaymentsByDate
  loadedPaymentsByYear: LoadedPayments
  paginationByYearAndPage: PaymentsPaginationByYearAndPage
  currentPagePagination: PaymentsMetaPagination
  availableYears: Array<string>
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
  availableYears: [],
}

/**
 * Redux action to get the users payment history
 */
export const getPayments =
  (year?: string, page = 1, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getPayments(year, page, screenID))))
    dispatch(dispatchStartGetPayments())
    let yearAndPage: string | undefined

    if (year) {
      // creates cache data key as year-page ex: 2017-1
      yearAndPage = createYearAndPageString(year, page)
    }

    const paymentsState = getState().payments

    // get stored list of payments
    const { loadedPaymentsByYear, paginationByYearAndPage: paginationByYear } = paymentsState
    const loadedPayments = getLoadedPayments(loadedPaymentsByYear, paginationByYear, yearAndPage || '')

    if (loadedPayments) {
      dispatch(dispatchFinishGetPayments({ payments: loadedPayments, yearAndPage }))
      return
    }

    try {
      const [startDate, endDate] = getFirstAndLastDayOfYear(year)

      const params: Params = startDate && endDate ? { startDate: startDate, endDate: endDate, 'page[number]': page.toString(), 'page[size]': DEFAULT_PAGE_SIZE.toString() } : {}

      const paymentsList = await api.get<PaymentsGetData>('/v0/payment-history', params)

      dispatch(dispatchFinishGetPayments({ payments: paymentsList, yearAndPage }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'getPayments: Payment History Service Error')
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

    dispatchFinishGetPayments: (state, action: PayloadAction<{ yearAndPage?: string; payments?: PaymentsGetData; error?: Error }>) => {
      const { payments, yearAndPage, error } = action.payload
      const paymentsData = payments?.data || []
      const paymentsByDate: PaymentsByDate = groupPaymentsByDate(paymentsData)
      const paymentsMap: PaymentsMap = mapPaymentsById(paymentsData)
      const availableYears = payments?.meta.availableYears || []

      if (availableYears.length > 0) {
        // if yearAndPage is undefined due to being the first call to the api with no dates create the key with the latest year sent by the api
        const yearPageKey = yearAndPage ? yearAndPage : createYearAndPageString(availableYears[0], 1)
        const currPaymentsList = state.loadedPaymentsByYear[yearPageKey]
        state.loadedPaymentsByYear[yearPageKey] = payments?.meta?.dataFromStore ? currPaymentsList : paymentsData
        state.paginationByYearAndPage[yearPageKey] = payments?.meta?.pagination || initialPaginationState
      }

      state.paymentsById = paymentsMap
      state.currentPagePayments = paymentsByDate
      state.currentPagePagination = payments?.meta.pagination || initialPaginationState
      state.error = error

      // if we already have the years for the picker from the first call we do not need it again. This will also prevent the picker from re-rendering and the selection changing to the latest.
      state.availableYears = state.availableYears.length !== 0 ? state.availableYears : availableYears
      state.loading = false
    },

    dispatchGetPayment: (state, action: PayloadAction<string>) => {
      const paymentId = action.payload
      const { paymentsById = {} } = state
      const payment: PaymentsData = paymentsById[paymentId]

      state.payment = payment
    },

    dispatchClearPaymentsOnLogout: () => {
      return { ...initialPaymentsState }
    },
  },
})

export const { dispatchFinishGetPayments, dispatchStartGetPayments, dispatchGetPayment, dispatchClearPaymentsOnLogout } = paymentstSlice.actions
export default paymentstSlice.reducer
