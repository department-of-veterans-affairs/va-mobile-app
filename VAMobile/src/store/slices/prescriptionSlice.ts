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
import { Events, UserAnalytics } from 'constants/analytics'
import { PrescriptionHistoryTabConstants, PrescriptionRefillData, PrescriptionSortOptionConstants, RefillStatusConstants } from 'store/api/types'
import { contains, filter, indexBy, sortBy } from 'underscore'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'

const prescriptionNonFatalErrorString = 'Prescription Service Error'

// Page size used to pull all prescriptions for a user
const ALL_RX_PAGE_SIZE = 5000

export type PrescriptionState = {
  loadingHistory: boolean
  loadingCount: boolean
  prescriptions?: PrescriptionsList
  pendingPrescriptions?: PrescriptionsList
  shippedPrescriptions?: PrescriptionsList
  filteredPrescriptions?: PrescriptionsList
  transferredPrescriptions?: PrescriptionsList
  prescriptionPagination: PrescriptionsPaginationData
  error?: api.APIError
  prescriptionsById: PrescriptionsMap
  refillableCount?: number
  nonRefillableCount?: number
  refillablePrescriptions?: PrescriptionsList
  loadingTrackingInfo: boolean
  trackingInfo?: Array<PrescriptionTrackingInfo>
  // Request refill (RefillScreen, RefillRequestSummary)
  submittingRequestRefills: boolean
  showLoadingScreenRequestRefills: boolean
  showLoadingScreenRequestRefillsRetry: boolean
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
  loadingTrackingInfo: false,
  trackingInfo: [],
  submittingRequestRefills: false,
  showLoadingScreenRequestRefills: false,
  showLoadingScreenRequestRefillsRetry: false,
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
      sort: 'prescription_name', // Parameters are snake case for the back end
    }

    try {
      const allData = await get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
      dispatch(dispatchFinishLoadAllPrescriptions({ allPrescriptions: allData }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `loadAllPrescriptions: ${prescriptionNonFatalErrorString}`)
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
        dispatch(dispatchFinishLoadAllPrescriptions({ allPrescriptions: undefined, error }))
      }
    }
  }

export const filterAndSortPrescriptions =
  (filters: string[], tab: string, sort: string, ascending: boolean): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartFilterAndSortPrescriptions())

    const state = getState()
    let prescriptionsToSort: PrescriptionsList = []

    // Start with the prefiltered lists based on the current tab
    switch (tab) {
      case PrescriptionHistoryTabConstants.ALL:
        prescriptionsToSort = state.prescriptions.prescriptions || []
        break
      case PrescriptionHistoryTabConstants.PENDING:
        prescriptionsToSort = state.prescriptions.pendingPrescriptions || []
        break
      case PrescriptionHistoryTabConstants.TRACKING:
        prescriptionsToSort = state.prescriptions.shippedPrescriptions || []
        break
    }

    let filteredList: PrescriptionsList = []

    // If there are no filters, don't filter the list
    if (filters && filters[0] === '') {
      filteredList = [...prescriptionsToSort]
    } else {
      // Apply the custom filter by
      filteredList = filter(prescriptionsToSort, (prescription) => {
        return contains(filters, prescription.attributes.refillStatus)
      })
    }

    let sortedList: PrescriptionsList = []

    // Sort the list
    switch (sort) {
      case PrescriptionSortOptionConstants.FACILITY_NAME:
      case PrescriptionSortOptionConstants.PRESCRIPTION_NAME:
      case PrescriptionSortOptionConstants.REFILL_REMAINING:
        sortedList = sortBy(filteredList, (a) => {
          return a.attributes[sort]
        })
        break
      case PrescriptionSortOptionConstants.REFILL_DATE:
        sortedList = sortBy(filteredList, (a) => {
          return new Date(a.attributes.refillDate || 0)
        })
        break
    }

    // For descending order, reverse the list
    if (!ascending) {
      sortedList.reverse()
    }

    dispatch(dispatchFinishFilterAndSortPrescriptions({ prescriptions: sortedList }))
  }

export const requestRefills =
  (prescriptions: PrescriptionsList): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchStartRequestRefills())
    let results: RefillRequestSummaryItems = []
    const prescriptionIds = prescriptions.map((prescription) => prescription.id)
    try {
      const response = await put<PrescriptionRefillData>('/v0/health/rx/prescriptions/refill', {
        ids: prescriptionIds,
      })
      const failedPrescriptionIds = response?.data.attributes.failedPrescriptionIds || []
      results = prescriptions.map((prescription) => ({
        submitted: !failedPrescriptionIds.includes(prescription.id),
        data: prescription,
      }))
      await logAnalyticsEvent(Events.vama_rx_refill_success(prescriptionIds))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `requestRefills : ${prescriptionNonFatalErrorString}`)
      }
      // It's safe to assume that if there's an error, none of the refills were successful
      results = prescriptions.map((prescription) => ({
        submitted: false,
        data: prescription,
      }))
      await logAnalyticsEvent(Events.vama_rx_refill_fail(prescriptionIds))
    }

    setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
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
      setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
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
    dispatchStartRequestRefills: (state) => {
      // RefillScreen
      state.submittingRequestRefills = true
      state.showLoadingScreenRequestRefills = true

      // RefillRequestSummary
      state.showLoadingScreenRequestRefillsRetry = true
    },
    dispatchFinishRequestRefills: (state, action: PayloadAction<{ refillRequestSummaryItems: RefillRequestSummaryItems }>) => {
      const { refillRequestSummaryItems } = action.payload
      // RefillScreen
      state.submittingRequestRefills = false

      // RefillRequestSummary
      state.showLoadingScreenRequestRefillsRetry = false

      // Both
      state.refillRequestSummaryItems = refillRequestSummaryItems
    },
    dispatchSetPrescriptionsNeedLoad: (state) => {
      const { refillRequestSummaryItems } = state
      // do a reload on refill data if some successfully submitted
      state.prescriptionsNeedLoad = refillRequestSummaryItems.some((item) => item.submitted)
    },
    dispatchClearLoadingRequestRefills: (state) => {
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
    dispatchFinishGetTrackingInfo: (state, action: PayloadAction<{ trackingInfo?: Array<PrescriptionTrackingInfo>; error?: APIError }>) => {
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
      const pendingPrescriptions: PrescriptionData[] = []
      const shippedPrescriptions: PrescriptionData[] = []
      const transferredPrescriptions: PrescriptionData[] = []
      const refillablePrescriptions: PrescriptionData[] = []

      prescriptions?.forEach((prescription) => {
        prescriptionsById[prescription.id] = prescription

        if (prescription.attributes.isTrackable) {
          shippedPrescriptions.push(prescription)
        }

        if (prescription.attributes.refillStatus === RefillStatusConstants.REFILL_IN_PROCESS || prescription.attributes.refillStatus === RefillStatusConstants.SUBMITTED) {
          pendingPrescriptions.push(prescription)
        }

        if (prescription.attributes.refillStatus === RefillStatusConstants.TRANSFERRED) {
          transferredPrescriptions.push(prescription)
        }

        if (prescription.attributes.isRefillable) {
          refillablePrescriptions.push(prescription)
        }
      })

      state.prescriptions = prescriptions
      state.pendingPrescriptions = pendingPrescriptions
      state.shippedPrescriptions = shippedPrescriptions
      state.transferredPrescriptions = transferredPrescriptions
      state.refillablePrescriptions = refillablePrescriptions

      state.loadingHistory = false
      state.prescriptionPagination = { ...meta?.pagination }
      state.prescriptionsById = prescriptionsById
      state.prescriptionsNeedLoad = false

      state.tabCounts = {
        '0': prescriptions?.length,
        '1': pendingPrescriptions.length,
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
  dispatchStartRequestRefills,
  dispatchFinishRequestRefills,
  dispatchClearLoadingRequestRefills,
  dispatchClearPrescriptionLogout,
  dispatchStartGetTrackingInfo,
  dispatchFinishGetTrackingInfo,
  dispatchStartLoadAllPrescriptions,
  dispatchFinishLoadAllPrescriptions,
  dispatchStartFilterAndSortPrescriptions,
  dispatchFinishFilterAndSortPrescriptions,
  dispatchSetPrescriptionsNeedLoad,
} = prescriptionSlice.actions
export default prescriptionSlice.reducer
