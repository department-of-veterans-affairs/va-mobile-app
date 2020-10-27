import createReducer from './createReducer'

export type PersonalInformationState = {
  loading: boolean
  emailSaved?: boolean
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
})
