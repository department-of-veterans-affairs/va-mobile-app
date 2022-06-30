import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from '../api'
import { APIError, PrescriptionsGetData, PrescriptionsList, PrescriptionsMap, PrescriptionsPaginationData, RefillRequestSummaryItems, ScreenIDTypes, get, put } from '../api'
import { AppThunk } from 'store'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { dispatchClearErrors, dispatchSetError } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { indexBy } from 'underscore'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

const prescriptionNonFatalErrorString = 'Prescription Service Error'

export type PrescriptionState = {
  loadingHisory: boolean
  prescriptions?: PrescriptionsList
  prescriptionPagination: PrescriptionsPaginationData
  error?: api.APIError
  prescriptionsById: PrescriptionsMap
  refillableCount?: number
  nonRefillableCount?: number
  refillablePrescriptions?: PrescriptionsList
  nonRefillablePrescriptions?: PrescriptionsList
  needsRefillableLoaded: boolean
  loadingRefillable: boolean
  // Request refill (RefillScreen, RefillRequestSummary)
  submittingRequestRefills: boolean
  showLoadingScreenRequestRefills: boolean
  showLoadingScreenRequestRefillsRetry: boolean
  submittedRequestRefillCount: number
  refillRequestSummaryItems: RefillRequestSummaryItems
}

export const initialPrescriptionState: PrescriptionState = {
  loadingHisory: false,
  prescriptionsById: {} as PrescriptionsMap,
  prescriptionPagination: {} as PrescriptionsPaginationData,
  refillableCount: 0,
  nonRefillableCount: 0,
  needsRefillableLoaded: true,
  loadingRefillable: false,
  submittingRequestRefills: false,
  showLoadingScreenRequestRefills: false,
  showLoadingScreenRequestRefillsRetry: false,
  submittedRequestRefillCount: 0,
  refillRequestSummaryItems: [],
}

export const getPrescriptions =
  (screenID?: ScreenIDTypes, page = 1): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchStartGetPrescriptions())

    try {
      const prescriptionData = await get<PrescriptionsGetData>('/v0/health/rx/prescriptions', {
        'page[number]': page.toString(),
        'page[size]': DEFAULT_PAGE_SIZE.toString(),
      })

      dispatch(dispatchFinishGetPrescriptions({ prescriptionData }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getPrescriptions: ${prescriptionNonFatalErrorString}`)
        dispatch(dispatchFinishGetPrescriptions({ prescriptionData: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
      }
    }
  }
export const getRefillablePrescriptions =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchStartGetAllPrescriptions())

    try {
      const prescriptionData = await get<PrescriptionsGetData>('/v0/health/rx/prescriptions', {
        'page[size]': '100',
      })

      dispatch(dispatchFinishGetAllPrescriptions({ prescriptionData }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getRefillablePrescriptions: ${prescriptionNonFatalErrorString}`)
        dispatch(dispatchFinishGetPrescriptions({ prescriptionData: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
      }
    }
  }

export const requestRefills =
  (prescriptions: PrescriptionsList): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartRequestRefills())
    const results: RefillRequestSummaryItems = []
    for (const p of prescriptions) {
      try {
        // return 204 on success, we just care if it succeed as any failures will go to the catch
        await put(`/v0/health/rx/prescriptions/${p.id}/refill`)
        results.push({
          submitted: true,
          data: p,
        })
      } catch (error) {
        if (isErrorObject(error)) {
          logNonFatalErrorToFirebase(error, `requestRefills : ${prescriptionNonFatalErrorString}`)
        }
        results.push({
          submitted: false,
          data: p,
        })
      } finally {
        const { submittedRequestRefillCount } = getState().prescriptions
        if (submittedRequestRefillCount < prescriptions.length) {
          dispatch(dispatchContinueRequestRefills())
        }
      }
    }

    dispatch(dispatchFinishRequestRefills({ refillRequestSummaryItems: results }))
  }
const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState: initialPrescriptionState,
  reducers: {
    dispatchStartGetPrescriptions: (state) => {
      state.loadingHisory = true
    },
    dispatchFinishGetPrescriptions: (state, action: PayloadAction<{ prescriptionData?: PrescriptionsGetData; error?: APIError }>) => {
      const { prescriptionData } = action.payload
      const { data: prescriptions, meta } = prescriptionData || ({} as PrescriptionsGetData)
      const prescriptionsById = indexBy(prescriptions || [], 'id')

      state.prescriptions = prescriptions
      state.loadingHisory = false
      state.prescriptionPagination = { ...meta?.pagination }
      state.prescriptionsById = prescriptionsById
    },
    dispatchStartGetRefillablePrescriptions: (state) => {
      state.loadingRefillable = true
    },
    dispatchFinishGetRefillablePrescriptions: (state, action: PayloadAction<{ prescriptionData?: PrescriptionsGetData; error?: APIError }>) => {
      const { prescriptionData, error } = action.payload
      const { data: prescriptions } = prescriptionData || ({} as PrescriptionsGetData)
      const refillable = prescriptions.filter((item) => item.attributes.isRefillable === true)
      const nonRefillable = prescriptions.filter((item) => item.attributes.isRefillable === false)

      state.loadingRefillable = false
      state.refillablePrescriptions = refillable
      state.refillableCount = refillable.length
      state.nonRefillablePrescriptions = nonRefillable
      state.nonRefillableCount = nonRefillable.length
      state.needsRefillableLoaded = !!error
    },
    dispatchStartRequestRefills: (state) => {
      // RefillScreen
      state.submittingRequestRefills = true
      state.showLoadingScreenRequestRefills = true

      // RefillRequestSummary
      state.showLoadingScreenRequestRefillsRetry = true

      // Both
      state.submittedRequestRefillCount = 1
    },
    dispatchContinueRequestRefills: (state) => {
      state.submittedRequestRefillCount += 1
    },
    dispatchFinishRequestRefills: (state, action: PayloadAction<{ refillRequestSummaryItems: RefillRequestSummaryItems }>) => {
      const { refillRequestSummaryItems } = action.payload
      // RefillScreen
      state.submittingRequestRefills = false

      // RefillRequestSummary
      state.showLoadingScreenRequestRefillsRetry = false

      // Both
      state.refillRequestSummaryItems = refillRequestSummaryItems
      // do a reload on refill data if some successfully submitted
      state.needsRefillableLoaded = refillRequestSummaryItems.some((item) => item.submitted)
    },
    dispatchClearLoadingRequestRefills: (state) => {
      // Both
      state.submittedRequestRefillCount = 0

      // RefillScreen
      state.showLoadingScreenRequestRefills = false

      // RefillRequestSummary
      state.showLoadingScreenRequestRefillsRetry = false
    },
    dispatchClearPrescriptionLogout: () => {
      return { ...initialPrescriptionState }
    },
  },
})

export const {
  dispatchStartGetPrescriptions,
  dispatchFinishGetPrescriptions,
  dispatchFinishGetRefillablePrescriptions: dispatchFinishGetAllPrescriptions,
  dispatchStartGetRefillablePrescriptions: dispatchStartGetAllPrescriptions,
  dispatchStartRequestRefills,
  dispatchContinueRequestRefills,
  dispatchFinishRequestRefills,
  dispatchClearLoadingRequestRefills,
  dispatchClearPrescriptionLogout,
} = prescriptionSlice.actions
export default prescriptionSlice.reducer
