import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from '../api'
import {
  APIError,
  PrescriptionData,
  PrescriptionTrackingInfo,
  PrescriptionTrackingInfoGetData,
  PrescriptionsGetData,
  PrescriptionsList,
  PrescriptionsMap,
  PrescriptionsPaginationData,
  RefillRequestSummaryItems,
  ScreenIDTypes,
  TabCounts,
  get,
  put,
} from '../api'
import { AppThunk } from 'store'
import { PrescriptionHistoryTabConstants, PrescriptionSortOptionConstants, RefillStatusConstants } from 'store/api/types'
import { contains, filter, indexBy } from 'underscore'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

const prescriptionNonFatalErrorString = 'Prescription Service Error'

// Page size used to pull all prescriptions for a user
const ALL_RX_PAGE_SIZE = 5000

export type PrescriptionState = {
  loadingHistory: boolean
  loadingCount: boolean
  prescriptions?: PrescriptionsList
  processingPrescriptions?: PrescriptionsList
  shippedPrescriptions?: PrescriptionsList
  filteredPrescriptions?: PrescriptionsList
  prescriptionPagination: PrescriptionsPaginationData
  error?: api.APIError
  prescriptionsById: PrescriptionsMap
  refillableCount?: number
  nonRefillableCount?: number
  refillablePrescriptions?: PrescriptionsList
  nonRefillablePrescriptions?: PrescriptionsList
  needsRefillableLoaded: boolean
  loadingRefillable: boolean
  loadingTrackingInfo: boolean
  trackingInfo?: PrescriptionTrackingInfo
  // Request refill (RefillScreen, RefillRequestSummary)
  submittingRequestRefills: boolean
  showLoadingScreenRequestRefills: boolean
  showLoadingScreenRequestRefillsRetry: boolean
  submittedRequestRefillCount: number
  refillRequestSummaryItems: RefillRequestSummaryItems
  tabCounts: TabCounts
  prescriptionsNeedLoad: boolean
}

export const initialPrescriptionState: PrescriptionState = {
  loadingHistory: false,
  loadingCount: false,
  prescriptionsById: {} as PrescriptionsMap,
  prescriptionPagination: {} as PrescriptionsPaginationData,
  refillableCount: 0,
  nonRefillableCount: 0,
  needsRefillableLoaded: true,
  loadingRefillable: false,
  loadingTrackingInfo: false,
  trackingInfo: undefined,
  submittingRequestRefills: false,
  showLoadingScreenRequestRefills: false,
  showLoadingScreenRequestRefillsRetry: false,
  submittedRequestRefillCount: 0,
  refillRequestSummaryItems: [],
  tabCounts: {},
  prescriptionsNeedLoad: true,
}

export const loadAllPrescriptions =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchStartLoadAllPrescriptions())

    const params = {
      'page[number]': '1',
      'page[size]': ALL_RX_PAGE_SIZE.toString(),
      sort: PrescriptionSortOptionConstants.PRESCRIPTION_NAME,
    }

    try {
      const allData = await get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
      dispatch(dispatchFinishLoadAllPrescriptions({ allPrescriptions: allData }))
    } catch (error) {
      if (isErrorObject(error)) {
        console.log('in error block')
        logNonFatalErrorToFirebase(error, `loadAllPrescriptions: ${prescriptionNonFatalErrorString}`)
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
        dispatch(dispatchFinishLoadAllPrescriptions({ allPrescriptions: undefined, error }))
      }
    }
  }

export const filterAndSortPrescriptions =
  (filters: string[], tab: string, _sort: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartFilterAndSortPrescriptions())

    const state = getState()
    let prescriptionsToSort: PrescriptionsList = []

    switch (tab) {
      case PrescriptionHistoryTabConstants.ALL:
        prescriptionsToSort = state.prescriptions.prescriptions || []
        break
      case PrescriptionHistoryTabConstants.PROCESSING:
        prescriptionsToSort = state.prescriptions.processingPrescriptions || []
        break
      case PrescriptionHistoryTabConstants.SHIPPED:
        prescriptionsToSort = state.prescriptions.shippedPrescriptions || []
        break
    }

    if (filters && filters[0] === '') {
      dispatch(dispatchFinishFilterAndSortPrescriptions({ prescriptions: prescriptionsToSort }))
    } else {
      const filteredList = filter(prescriptionsToSort, (prescription) => {
        return contains(filters, prescription.attributes.refillStatus)
      })
      dispatch(dispatchFinishFilterAndSortPrescriptions({ prescriptions: filteredList }))
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

export const getTrackingInfo =
  (id: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getTrackingInfo(id, screenID))))

    dispatch(dispatchStartGetTrackingInfo())

    try {
      const trackingInfo = await api.get<PrescriptionTrackingInfoGetData>(`/v0/health/rx/prescriptions/${id}/tracking`)
      dispatch(dispatchFinishGetTrackingInfo({ trackingInfo: trackingInfo?.data }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getTrackingInfo : ${prescriptionNonFatalErrorString}`)
        dispatch(dispatchFinishGetTrackingInfo({ trackingInfo: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState: initialPrescriptionState,
  reducers: {
    dispatchStartGetPrescriptions: (state) => {
      state.loadingHistory = true
    },
    dispatchFinishGetPrescriptions: (state, action: PayloadAction<{ prescriptionData?: PrescriptionsGetData; error?: APIError }>) => {
      const { prescriptionData } = action.payload
      const { data: prescriptions, meta } = prescriptionData || ({} as PrescriptionsGetData)
      const prescriptionsById = indexBy(prescriptions || [], 'id')

      state.prescriptions = prescriptions
      state.loadingHistory = false
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
      state.submittingRequestRefills = false

      // RefillRequestSummary
      state.showLoadingScreenRequestRefillsRetry = false
    },
    dispatchClearPrescriptionLogout: () => {
      return { ...initialPrescriptionState }
    },
    dispatchStartGetTrackingInfo: (state) => {
      state.loadingTrackingInfo = true
    },
    dispatchFinishGetTrackingInfo: (state, action: PayloadAction<{ trackingInfo?: PrescriptionTrackingInfo; error?: APIError }>) => {
      const { trackingInfo, error } = action.payload
      state.trackingInfo = trackingInfo
      state.error = error
      state.loadingTrackingInfo = false
    },
    dispatchStartLoadAllPrescriptions: (state) => {
      state.loadingHistory = true
    },
    dispatchFinishLoadAllPrescriptions: (state, action: PayloadAction<{ allPrescriptions?: PrescriptionsGetData; error?: APIError }>) => {
      const { allPrescriptions } = action.payload

      const { data: prescriptions, meta } = allPrescriptions || ({} as PrescriptionsGetData)

      const prescriptionsById: PrescriptionsMap = {}
      const processingPrescriptions: PrescriptionData[] = []
      const shippedPrescriptions: PrescriptionData[] = []

      prescriptions.forEach((prescription) => {
        prescriptionsById[prescription.id] = prescription

        if (prescription.attributes.isTrackable) {
          shippedPrescriptions.push(prescription)
        }

        if (prescription.attributes.refillStatus === RefillStatusConstants.REFILL_IN_PROCESS || prescription.attributes.refillStatus === RefillStatusConstants.SUBMITTED) {
          processingPrescriptions.push(prescription)
        }
      })

      state.prescriptions = prescriptions
      state.filteredPrescriptions = prescriptions
      state.processingPrescriptions = processingPrescriptions
      state.shippedPrescriptions = shippedPrescriptions

      state.loadingHistory = false
      state.prescriptionPagination = { ...meta?.pagination }
      state.prescriptionsById = prescriptionsById
      state.prescriptionsNeedLoad = false

      state.tabCounts = {
        '0': prescriptions.length,
        '1': processingPrescriptions.length,
        '2': shippedPrescriptions.length,
      }
    },
    dispatchStartFilterAndSortPrescriptions: (state) => {
      state.loadingHistory = true
    },
    dispatchFinishFilterAndSortPrescriptions: (state, action: PayloadAction<{ prescriptions?: PrescriptionsList }>) => {
      const { prescriptions } = action.payload

      state.filteredPrescriptions = prescriptions
      state.loadingHistory = false
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
  dispatchStartGetTrackingInfo,
  dispatchFinishGetTrackingInfo,
  dispatchStartLoadAllPrescriptions,
  dispatchFinishLoadAllPrescriptions,
  dispatchStartFilterAndSortPrescriptions,
  dispatchFinishFilterAndSortPrescriptions,
} = prescriptionSlice.actions
export default prescriptionSlice.reducer
