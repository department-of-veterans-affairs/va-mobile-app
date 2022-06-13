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
  loading: boolean
  prescriptions?: PrescriptionsList
  prescriptionPagination: PrescriptionsPaginationData
  error?: api.APIError
  prescriptionsById: PrescriptionsMap
}

export const initialPrescriptionState: PrescriptionState = {
  loading: false,
  prescriptionsById: {} as PrescriptionsMap,
  prescriptionPagination: {} as PrescriptionsPaginationData,
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
        logNonFatalErrorToFirebase(error, `getVaccines: ${prescriptionNonFatalErrorString}`)
        dispatch(dispatchFinishGetPrescriptions({ prescriptionData: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
      }
    }
  }

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState: initialPrescriptionState,
  reducers: {
    dispatchStartGetPrescriptions: (state) => {
      state.loading = true
    },
    dispatchFinishGetPrescriptions: (state, action: PayloadAction<{ prescriptionData?: PrescriptionsGetData; error?: APIError }>) => {
      const { prescriptionData } = action.payload
      const { data: prescriptions, meta } = prescriptionData || ({} as PrescriptionsGetData)
      const prescriptionsById = indexBy(prescriptions || [], 'id')

      state.prescriptions = prescriptions
      state.loading = false
      state.prescriptionPagination = { ...meta?.pagination }
      state.prescriptionsById = prescriptionsById
    },
  },
})

export const { dispatchStartGetPrescriptions, dispatchFinishGetPrescriptions } = prescriptionSlice.actions
export default prescriptionSlice.reducer
