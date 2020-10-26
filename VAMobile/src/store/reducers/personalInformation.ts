import {
  PersonalInformationFinishEditEmailPayload,
  PersonalInformationPayload,
  PersonalInformationStartEditEmailPayload,
  PersonalInformationStartEditPhoneNumPayload,
} from '../types'
import createReducer from './createReducer'

export type PersonalInformationState = {
  loading: boolean
  error?: Error
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
}

export default createReducer<PersonalInformationState>(initialPersonalInformationState, {
  PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER: (state: PersonalInformationState, payload: PersonalInformationStartEditPhoneNumPayload): PersonalInformationState => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },

  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: (state: PersonalInformationState, { error }: PersonalInformationPayload): PersonalInformationState => {
    return {
      ...state,
      error,
      loading: false,
    }
  },
  PERSONAL_INFORMATION_START_EDIT_EMAIL: (state: PersonalInformationState, payload: PersonalInformationStartEditEmailPayload): PersonalInformationState => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  PERSONAL_INFORMATION_FINISH_EDIT_EMAIL: (state: PersonalInformationState, { error }: PersonalInformationFinishEditEmailPayload): PersonalInformationState => {
    return {
      ...state,
      error,
      loading: false,
    }
  },
})
