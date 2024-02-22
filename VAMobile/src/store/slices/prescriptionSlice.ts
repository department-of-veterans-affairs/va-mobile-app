import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TFunction } from 'i18next'
import { contains, filter, indexBy, sortBy } from 'underscore'

import { Events, UserAnalytics } from 'constants/analytics'
import { AppThunk } from 'store'
import { PrescriptionRefillData, PrescriptionSortOptionConstants, RefillStatusConstants } from 'store/api/types'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getTextForRefillStatus } from 'utils/prescriptions'

import * as api from '../api'
import {
  APIError,
  PrescriptionData,
  PrescriptionStatusCountData,
  PrescriptionTrackingInfo,
  PrescriptionTrackingInfoGetData,
  PrescriptionsGetData,
  PrescriptionsList,
  PrescriptionsMap,
  PrescriptionsPaginationData,
  RefillRequestSummaryItems,
  ScreenIDTypes,
  get,
  put,
} from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'

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
  prescriptionsNeedLoad: boolean
  prescriptionStatusCount: PrescriptionStatusCountData
  prescriptionFirstRetrieval: boolean
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
  prescriptionsNeedLoad: true,
  prescriptionStatusCount: {} as PrescriptionStatusCountData,
  prescriptionFirstRetrieval: true,
}

export const loadAllPrescriptions =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartLoadAllPrescriptions())

    const params = {
      'page[number]': '1',
      'page[size]': ALL_RX_PAGE_SIZE.toString(),
      sort: 'refill_status', // Parameters are snake case for the back end
    }

    try {
      const allData = await get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
      if (getState().prescriptions.prescriptionFirstRetrieval && allData?.meta?.prescriptionStatusCount) {
        await logAnalyticsEvent(Events.vama_hs_rx_count(allData.meta.prescriptionStatusCount.isRefillable || 0))
      }
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
  (filters: string[], sort: string, ascending: boolean, t: TFunction): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartFilterAndSortPrescriptions())

    const state = getState()
    const prescriptionsToSort = state.prescriptions.prescriptions || []

    let filteredList: PrescriptionsList = []

    // If there are no filters, don't filter the list
    if (filters[0] === '') {
      filteredList = [...prescriptionsToSort]
    } else if (filters[0] === RefillStatusConstants.PENDING) {
      filteredList = state.prescriptions.pendingPrescriptions || []
    } else if (filters[0] === RefillStatusConstants.TRACKING) {
      filteredList = state.prescriptions.shippedPrescriptions || []
    } else {
      // Apply the custom filter by
      filteredList = filter(prescriptionsToSort, (prescription) => {
        return contains(filters, prescription.attributes.refillStatus)
      })
    }

    let sortedList: PrescriptionsList = []

    // Sort the list
    switch (sort) {
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
      case PrescriptionSortOptionConstants.REFILL_STATUS:
        sortedList = sortBy(filteredList, (a) => {
          return getTextForRefillStatus(a.attributes[sort] as api.RefillStatus, t)
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
    dispatchFinishGetPrescriptions: (
      state,
      action: PayloadAction<{ prescriptionData?: PrescriptionsGetData; error?: APIError }>,
    ) => {
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
    dispatchFinishRequestRefills: (
      state,
      action: PayloadAction<{ refillRequestSummaryItems: RefillRequestSummaryItems }>,
    ) => {
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
    dispatchFinishGetTrackingInfo: (
      state,
      action: PayloadAction<{ trackingInfo?: Array<PrescriptionTrackingInfo>; error?: APIError }>,
    ) => {
      const { trackingInfo, error } = action.payload
      state.trackingInfo = trackingInfo
      state.error = error
      state.loadingTrackingInfo = false
    },
    dispatchStartLoadAllPrescriptions: (state) => {
      state.loadingHistory = true
    },
    dispatchFinishLoadAllPrescriptions: (
      state,
      action: PayloadAction<{ allPrescriptions?: PrescriptionsGetData; error?: APIError }>,
    ) => {
      const { allPrescriptions, error } = action.payload

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

        if (
          prescription.attributes.refillStatus === RefillStatusConstants.REFILL_IN_PROCESS ||
          prescription.attributes.refillStatus === RefillStatusConstants.SUBMITTED
        ) {
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
      state.prescriptionPagination = { ...meta.pagination }
      state.prescriptionStatusCount = { ...meta.prescriptionStatusCount }
      state.prescriptionsById = prescriptionsById
      state.prescriptionsNeedLoad = false
      state.prescriptionFirstRetrieval = !!error
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
