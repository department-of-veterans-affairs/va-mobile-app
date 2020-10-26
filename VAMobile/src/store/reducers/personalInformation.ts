import { PersonalInformationPayload, PersonalInformationStartEditPhoneNumPayload } from '../types'
import createReducer from './createReducer'

export type PersonalInformationState = {
  loading: boolean
  error?: Error
  emailSaved: boolean
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
  emailSaved: false,
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
})
