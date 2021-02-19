import * as api from '../api'
import { AddressData, AddressValidationScenarioTypes, SuggestedAddress } from '../api'
import { getFormattedPhoneNumber } from 'utils/common'
import createReducer from './createReducer'

export type PersonalInformationState = {
  loading: boolean
  emailSaved?: boolean
  phoneNumberSaved?: boolean
  addressSaved?: boolean
  profile?: api.UserDataProfile
  error?: Error
  needsDataLoad?: boolean
  addressData?: AddressData
  suggestedAddresses?: Array<SuggestedAddress>
  confirmedSuggestedAddresses?: Array<SuggestedAddress>
  addressValidationScenario?: AddressValidationScenarioTypes
  validationKey?: number
  showValidation?: boolean
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
  needsDataLoad: true,
}

export default createReducer<PersonalInformationState>(initialPersonalInformationState, {
  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
      phoneNumberSaved: false,
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
      needsDataLoad: !error,
      phoneNumberSaved: !error,
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
      needsDataLoad: emailSaved,
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
      // remove fields that are empty, undefined or 'NOT_FOUND'
      const listOfNameComponents = [profile.firstName, profile.middleName, profile.lastName].filter((name) => {
        return !!name && name !== 'NOT_FOUND'
      })
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
      needsDataLoad: false,
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
      needsDataLoad: !error,
      addressSaved: !error,
      showValidation: false,
    }
  },
  PERSONAL_INFORMATION_START_VALIDATE_ADDRESS: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS: (state, { suggestedAddresses, confirmedSuggestedAddresses, addressData, addressValidationScenario, validationKey }) => {
    return {
      ...state,
      loading: false,
      addressData,
      suggestedAddresses,
      confirmedSuggestedAddresses,
      addressValidationScenario,
      validationKey,
      showValidation: !!addressData,
    }
  },
  PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS: (state, payload) => {
    return {
      ...state,
      ...payload,
      addressSaved: false,
    }
  },
  PERSONAL_INFORMATION_ON_LOGOUT: (_state, _payload) => {
    return {
      ...initialPersonalInformationState,
    }
  },
})
