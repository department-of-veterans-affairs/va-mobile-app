import * as api from 'store/api'
import { AppThunk } from 'store'
import { AppointmentFlowFormDataType, FacilitiesFilterType, ScreenIDTypes, UserCCEligibilityAttributes, UserFacilityInfo, UserVAEligibilityService } from 'store/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { filter } from 'underscore'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

export type RequestAppointmentState = {
  loadingVAEligibility: boolean
  loadingCCEligibility: boolean
  loadingUserFacilities: boolean
  userFacilities: Array<UserFacilityInfo>
  ccSupportedFacilities: Array<string>
  vaEligibleTypeOfCares: Array<UserVAEligibilityService>
  error?: Error
  ccEligibilityChecked?: boolean
  ccEligible?: boolean
  appointmentFlowFormData: AppointmentFlowFormDataType
}

export const initialRequestAppointmentState: RequestAppointmentState = {
  loadingVAEligibility: false,
  loadingCCEligibility: false,
  loadingUserFacilities: false,
  userFacilities: [],
  ccSupportedFacilities: [],
  vaEligibleTypeOfCares: [],
  ccEligibilityChecked: false,
  ccEligible: false,
  appointmentFlowFormData: {},
}

/** Gets the list of all the cares including sub care. Each care will include a requestEligible and directEligible
 * array containing the facility that the user is register that are eligible for either. If the user is not eligible
 * than those array will be empty
 * */
export const getUserVAEligibility =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getUserVAEligibility(screenID))))

    try {
      const facilities = filter(getState().patient.facilities || [], (item) => {
        return item.isCerner === false
      }).map((item) => item.facilityId)

      dispatch(dispatchStartGeVAEligibility())
      const eligibilityData = await api.get<api.UserVAEligibilityData>('/v0/appointments/va/eligibility', {
        'facilityIds[]': facilities,
      })

      dispatch(dispatchFinishGetVAEligibility({ eligibilityData: eligibilityData?.data.attributes.services, ccSupported: eligibilityData?.data.attributes.ccSupported }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'getUserEligibility: Request Appointment Service Error')
        dispatch(dispatchFinishGetVAEligibility({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/** Return if a user is eligible for a care. Right now the care to check
 * can only be one of following options primaryCare, nutrition, podiatry, optometry, audiology.
 * */
export const getUserCommunityCareEligibility =
  (serviceType: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getUserVAEligibility(screenID))))

    try {
      dispatch(dispatchStartGetCommunityCareEligibility())
      const eligibilityData = await api.get<api.UserCCEligibilityData>(`/v0/appointments/community_care/eligibility/${serviceType}`)

      dispatch(dispatchFinishGetCommunityCareEligibility({ eligibilityData: eligibilityData?.data.attributes }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'getUserEligibility: Request Appointment Service Error')
        dispatch(dispatchFinishGetCommunityCareEligibility({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

// Retreives facilities info for a given user. The sort values are "current" "home" "alphabetical" "appointments"
export const getUserFacilities =
  (sortBy: FacilitiesFilterType, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getUserFacilities(sortBy, screenID))))

    try {
      dispatch(dispatchStartGetUserFacilities())
      const facilities = await api.get<api.UserFacilitiesData>(`/v0/facilities-info/${sortBy}`)

      dispatch(dispatchFinishGetUserFacilities({ facilities: facilities?.data.attributes.facilities }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'getUserFacilities: Request Appointment Service Error')
        dispatch(dispatchFinishGetUserFacilities({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

// resets the checking for community care boolean
export const finishCheckingCCEligibility = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishCheckingCCEligibility())
}

export const updateFormData =
  (data: AppointmentFlowFormDataType): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateFormData(data))
  }
export const resetFormData = (): AppThunk => async (dispatch) => {
  dispatch(dispatchResetFormData())
}

const requestAppointmentSlice = createSlice({
  name: 'requestAppointment',
  initialState: initialRequestAppointmentState,
  reducers: {
    dispatchStartGeVAEligibility: (state) => {
      state.loadingVAEligibility = true
    },
    dispatchStartGetUserFacilities: (state) => {
      state.loadingUserFacilities = true
    },
    dispatchStartGetCommunityCareEligibility: (state) => {
      state.loadingCCEligibility = true
    },
    dispatchFinishGetVAEligibility: (state, action: PayloadAction<{ eligibilityData?: Array<UserVAEligibilityService>; ccSupported?: Array<string>; error?: Error }>) => {
      const { eligibilityData, ccSupported, error } = action.payload

      state.loadingVAEligibility = false
      state.vaEligibleTypeOfCares = eligibilityData || []
      state.ccSupportedFacilities = ccSupported || []
      state.error = error
    },
    dispatchFinishGetUserFacilities: (state, action: PayloadAction<{ facilities?: Array<UserFacilityInfo>; error?: Error }>) => {
      const { facilities, error } = action.payload

      state.loadingUserFacilities = false
      state.userFacilities = facilities || []
      state.error = error
    },
    dispatchFinishGetCommunityCareEligibility: (state, action: PayloadAction<{ eligibilityData?: UserCCEligibilityAttributes; error?: Error }>) => {
      const { eligibilityData, error } = action.payload

      state.loadingCCEligibility = false
      state.ccEligibilityChecked = error ? false : true
      state.ccEligible = eligibilityData?.eligible
    },
    dispatchFinishCheckingCCEligibility: (state) => {
      state.ccEligibilityChecked = false
    },
    dispatchUpdateFormData: (state, action: PayloadAction<AppointmentFlowFormDataType>) => {
      state.appointmentFlowFormData = { ...state.appointmentFlowFormData, ...action.payload }
    },
    dispatchResetFormData: (state) => {
      state.appointmentFlowFormData = {}
    },
  },
})

export const {
  dispatchStartGeVAEligibility,
  dispatchStartGetUserFacilities,
  dispatchFinishGetVAEligibility,
  dispatchFinishGetUserFacilities,
  dispatchFinishGetCommunityCareEligibility,
  dispatchStartGetCommunityCareEligibility,
  dispatchFinishCheckingCCEligibility,
  dispatchUpdateFormData,
  dispatchResetFormData,
} = requestAppointmentSlice.actions
export default requestAppointmentSlice.reducer
