import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from '../api'
import { APIError, PrescriptionsGetData, PrescriptionsList, PrescriptionsMap, PrescriptionsPaginationData, ScreenIDTypes, get } from '../api'
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
  needsRefillableLoaded?: boolean
  loadingRefillable: boolean
  loadingRequestRefills: boolean
  showLoadingScreenRequestRefills: boolean
  submittedRequestRefillCount: number
}

export const initialPrescriptionState: PrescriptionState = {
  loadingHisory: false,
  prescriptionsById: {} as PrescriptionsMap,
  prescriptionPagination: {} as PrescriptionsPaginationData,
  refillableCount: 0,
  nonRefillableCount: 0,
  loadingRefillable: false,
  loadingRequestRefills: false,
  showLoadingScreenRequestRefills: false,
  submittedRequestRefillCount: 0,
}

export const getPrescriptions =
  (screenID?: ScreenIDTypes, page = 1, filter?: string, sort?: string): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchStartGetPrescriptions())

    /**
     * Bypassing the standard parameter because of an encoding issue for the filter params. When encoded, the service
     * throws a 400, so we are adding them as raw strings to the url because they are all known values coming from
     * the app
     *
     * TODO: replace with the params arg if issue is fixed on the back end
     **/
    let uri = `/v0/health/rx/prescriptions?page[number]=${page.toString()}&page[size]=${DEFAULT_PAGE_SIZE.toString()}`

    // const pageParams = {
    //   'page[number]': page.toString(),
    //   'page[size]': DEFAULT_PAGE_SIZE.toString(),
    // }

    // let filterParams = {}
    if (filter) {
      // filterParams = {
      //   'filter[refill_status][eq]': filter,
      // }
      uri += `&filter[[refill_status][eq]]=${filter}`
    }

    // let sortParams = {}
    if (sort) {
      uri += `&sort=${sort}`
      // sortParams = {
      //   'sort': sort,
      // }
    }

    // const params = {
    //   ...pageParams,
    //   ...filterParams,
    //   ...sortParams,
    // }

    try {
      // const prescriptionData = await get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
      const prescriptionData = await get<PrescriptionsGetData>(uri)

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
  async (dispatch) => {
    dispatch(dispatchStartRequestRefills())

    try {
      // TODO integrate with real endpoint
      const totalPrescriptions = prescriptions.length
      let x = 1
      const intervalID = setInterval(() => {
        if (x++ < totalPrescriptions) {
          dispatch(dispatchContinueRequestRefills())
        }

        if (x >= totalPrescriptions) {
          clearInterval(intervalID)
          dispatch(dispatchFinishRequestRefills())
        }
      }, 3000)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `requestRefills : ${prescriptionNonFatalErrorString}`)
        // TODO add code to handle error
        // dispatch(dispatchFinishRequestRefills({ prescriptionData: undefined, error }))
      }
    }
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
      state.loadingRequestRefills = true
      state.showLoadingScreenRequestRefills = true
      state.submittedRequestRefillCount = 1
    },
    dispatchContinueRequestRefills: (state) => {
      state.submittedRequestRefillCount += 1
    },
    dispatchFinishRequestRefills: (state) => {
      state.loadingRequestRefills = false
    },
    dispatchClearLoadingRequestRefills: (state) => {
      state.submittedRequestRefillCount = 0
      state.showLoadingScreenRequestRefills = false
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
} = prescriptionSlice.actions
export default prescriptionSlice.reducer
