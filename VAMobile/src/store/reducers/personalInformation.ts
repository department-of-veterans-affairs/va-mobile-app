import * as api from '../api'
import { getFormattedPhoneNumber } from 'utils/common'
import createReducer from './createReducer'

export type PersonalInformationState = {
  loading: boolean
  emailSaved?: boolean
  phoneNumberUpdated?: boolean
  addressSaved?: boolean
  profile?: api.UserDataProfile
  error?: Error
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
}

export default createReducer<PersonalInformationState>(initialPersonalInformationState, {
  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
      phoneNumberUpdated: false,
    }
  },
  PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },

  PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER: (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
      phoneNumberUpdated: !error,
    }
  },
  PERSONAL_INFORMATION_FINISH_EDIT_EMAIL: (state, payload) => {
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
  PERSONAL_INFORMATION_FINISH_SAVE_EMAIL: (state, { error }) => {
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
      const listOfNameComponents = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean)
      profile.fullName = listOfNameComponents.join(' ').trim()

      profile.formattedHomePhone = getFormattedPhoneNumber(profile.homePhoneNumber)
      profile.formattedMobilePhone = getFormattedPhoneNumber(profile.mobilePhoneNumber)
      profile.formattedWorkPhone = getFormattedPhoneNumber(profile.workPhoneNumber)
      profile.formattedFaxPhone = getFormattedPhoneNumber(profile.faxNumber)
    }
    return {
      ...state,
      profile,
      error,
      loading: false,
    }
  },
  PERSONAL_INFORMATION_START_SAVE_ADDRESS: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS: (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
      addressSaved: !error,
    }
  },
  PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS: (state, payload) => {
    return {
      ...state,
      ...payload,
      addressSaved: false,
    }
  },
})
