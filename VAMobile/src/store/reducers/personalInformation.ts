import * as api from '../api'
import { getFormattedPhoneNumber } from 'utils/common'
import createReducer from './createReducer'

export type PersonalInformationState = {
  loading: boolean
  emailSaved?: boolean
  profile?: api.UserDataProfile
  error?: Error
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
}

export default createReducer<PersonalInformationState>(initialPersonalInformationState, {
  PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },

  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    }
  },
  PERSONAL_INFORMATION_START_EDIT_EMAIL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
      emailSaved: false,
    }
  },
  PERSONAL_INFORMATION_START_SAVE_EMAIL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  PERSONAL_INFORMATION_FINISH_EDIT_EMAIL: (state, { error }) => {
    const emailSaved = !error
    return {
      ...state,
      error,
      loading: false,
      emailSaved,
    }
  },
  PERSONAL_INFORMATION_START_GET_INFO: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  PERSONAL_INFORMATION_FINISH_GET_INFO: (state, { profile, error }) => {
    if (profile) {
      const listOfNameComponents = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean)
      profile.full_name = listOfNameComponents.join(' ').trim()

      profile.formatted_home_phone = getFormattedPhoneNumber(profile.home_phone)
      profile.formatted_mobile_phone = getFormattedPhoneNumber(profile.mobile_phone)
      profile.formatted_work_phone = getFormattedPhoneNumber(profile.work_phone)
      profile.formatted_fax_phone = getFormattedPhoneNumber(profile.fax_phone)
    }
    return {
      ...state,
      profile,
      error,
      loading: false,
    }
  },
})
