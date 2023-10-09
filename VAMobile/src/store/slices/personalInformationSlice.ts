import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from 'store'
import { ScreenIDTypes, UserData, UserDataProfile, get } from '../api'
import { UserAnalytics } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getAllFieldsThatExist, isErrorObject, sanitizeString } from 'utils/common'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'

const { ENVIRONMENT } = getEnv()

export type PersonalInformationState = {
  loading: boolean
  profile?: UserDataProfile
  error?: Error
  needsDataLoad: boolean
  preloadComplete: boolean
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
  needsDataLoad: true,
  preloadComplete: false,
}

const personalInformationNonFatalErrorString = 'Personal Information Service Error'

/**
 * Redux action to get user profile
 */
export const getProfileInfo =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getProfileInfo(screenID))))

    try {
      dispatch(dispatchStartGetProfileInfo())
      const user = await get<UserData>('/v1/user')
      const profile = user?.data.attributes.profile
      dispatch(dispatchFinishGetProfileInfo({ profile }))
      await setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getProfileInfo: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishGetProfileInfo({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const peronalInformationSlice = createSlice({
  name: 'personalInformation',
  initialState: initialPersonalInformationState,
  reducers: {
    dispatchStartGetProfileInfo: (state) => {
      state.loading = true
    },

    dispatchFinishGetProfileInfo: (state, action: PayloadAction<{ profile?: UserDataProfile; error?: Error }>) => {
      const { profile, error } = action.payload
      if (profile) {
        profile.firstName = sanitizeString(profile.firstName)
        profile.middleName = sanitizeString(profile.middleName)
        profile.lastName = sanitizeString(profile.lastName)
        profile.fullName = getAllFieldsThatExist([profile.firstName, profile.middleName, profile.lastName]).join(' ').trim()

        // Reset these since this information is now being pulled from the demographics endpoint.
        // This can be removed when we switch over to the `v2/user` endpoint.
        profile.preferredName = ''
        profile.genderIdentity = ''
      }

      state.profile = profile
      state.error = error
      state.loading = false
      state.needsDataLoad = !!error
      state.preloadComplete = true
    },

    dispatchProfileLogout: () => {
      return {
        ...initialPersonalInformationState,
      }
    },
  },
})

export const { dispatchStartGetProfileInfo, dispatchFinishGetProfileInfo, dispatchProfileLogout } = peronalInformationSlice.actions
export default peronalInformationSlice.reducer
