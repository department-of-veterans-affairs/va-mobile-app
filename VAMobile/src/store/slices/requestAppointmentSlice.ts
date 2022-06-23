import * as api from 'store/api'
import { AppThunk } from 'store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ScreenIDTypes, UserEligibilityService, UserFacilityInfo } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { filter } from 'underscore'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

export type RequestAppointmentState = {
  loadingEligibility: boolean
  loadingUserFacilities: boolean
  userFacilities: Array<UserFacilityInfo>
  eligibleTypeOfCares: Array<UserEligibilityService>
  error?: Error
}

export const initialRequestAppointmentState: RequestAppointmentState = {
  loadingEligibility: false,
  loadingUserFacilities: false,
  userFacilities: [],
  eligibleTypeOfCares: [],
}

export const getUserEligibility =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getUserEligibility(screenID))))

    try {
      const facilities = filter(getState().patient.facilities || [], (item) => {
        return item.isCerner === false
      }).map((item) => item.facilityId)

      dispatch(dispatchStartGetEligibility())
      const eligibilityData = await api.get<api.UserEligibilityData>('/v0/appointments/va/eligibility', {
        'facilityIds[]': facilities,
      })

      dispatch(dispatchFinishGetEligibility({ eligibilityData: eligibilityData?.data.attributes.services }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'getUserEligibility: Request Appointment Service Error')
        dispatch(dispatchFinishGetEligibility({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }
export const getUserFacilities =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getUserFacilities(screenID))))

    try {
      dispatch(dispatchStartGetUserFacilities())
      const facilities = await api.get<api.UserFacilitiesData>('/v0/facilities-info/home')

      dispatch(dispatchFinishGetUserFacilities({ facilities: facilities?.data.attributes.facilities }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'getUserFacilities: Request Appointment Service Error')
        dispatch(dispatchFinishGetUserFacilities({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

const requestAppointmentSlice = createSlice({
  name: 'requestAppointment',
  initialState: initialRequestAppointmentState,
  reducers: {
    dispatchStartGetEligibility: (state) => {
      state.loadingEligibility = true
    },
    dispatchStartGetUserFacilities: (state) => {
      state.loadingUserFacilities = true
    },
    dispatchFinishGetEligibility: (state, action: PayloadAction<{ eligibilityData?: Array<UserEligibilityService>; error?: Error }>) => {
      const { eligibilityData, error } = action.payload

      state.loadingEligibility = false
      state.eligibleTypeOfCares = eligibilityData || []
      state.error = error
    },
    dispatchFinishGetUserFacilities: (state, action: PayloadAction<{ facilities?: Array<UserFacilityInfo>; error?: Error }>) => {
      const { facilities, error } = action.payload

      state.loadingUserFacilities = false
      state.userFacilities = facilities || []
      state.error = error
    },
  },
})

export const { dispatchStartGetEligibility, dispatchStartGetUserFacilities, dispatchFinishGetEligibility, dispatchFinishGetUserFacilities } = requestAppointmentSlice.actions
export default requestAppointmentSlice.reducer
