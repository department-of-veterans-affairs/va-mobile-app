import * as api from '../api'
import {
  AuthCredentialData,
  AuthFinishLoginPayload,
  AuthInitializePayload,
  AuthShowWebLoginPayload,
  AuthStartLoginPayload,
  AuthUpdateStoreTokenWithBioPayload,
  LOGIN_PROMPT_TYPE,
  PersonalInformationFinishEditEmailPayload,
  PersonalInformationStartEditEmailPayload,
} from 'store/types'
import { getFormattedPhoneNumber } from 'utils/common'
import createReducer from './createReducer'

export type AuthState = {
  loading: boolean
  initializing: boolean
  error?: Error
  loggedIn: boolean
  loginPromptType?: LOGIN_PROMPT_TYPE
  webLoginUrl?: string
  profile?: api.UserDataProfile
  authCredentials?: AuthCredentialData
  canStoreWithBiometric?: boolean
  shouldStoreWithBiometric?: boolean
  emailSaved: boolean
}

export const initialAuthState: AuthState = {
  loading: false,
  initializing: true,
  loggedIn: false,
  emailSaved: false,
}

const initialState = initialAuthState

export default createReducer<AuthState>(initialState, {
  AUTH_INITIALIZE: (_state: AuthState, payload: AuthInitializePayload): AuthState => {
    if (payload.profile) {
      const { profile } = payload
      const listOfNameComponents = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean)
      payload.profile.full_name = listOfNameComponents.join(' ').trim()

      payload.profile.formatted_home_phone = getFormattedPhoneNumber(profile.home_phone)
      payload.profile.formatted_mobile_phone = getFormattedPhoneNumber(profile.mobile_phone)
      payload.profile.formatted_work_phone = getFormattedPhoneNumber(profile.work_phone)
      payload.profile.formatted_fax_phone = getFormattedPhoneNumber(profile.fax_phone)
    }

    return {
      ...initialState,
      ...payload,
      initializing: false,
      loggedIn: !!payload.profile,
    }
  },
  AUTH_START_LOGIN: (_state: AuthState, payload: AuthStartLoginPayload): AuthState => {
    return {
      ...initialState,
      ...payload,
      initializing: false,
      loading: true,
    }
  },
  AUTH_FINISH_LOGIN: (state: AuthState, payload: AuthFinishLoginPayload): AuthState => {
    return {
      ...state,
      ...payload,
      webLoginUrl: undefined,
      loading: false,
      loggedIn: !!payload.profile,
    }
  },
  AUTH_SHOW_WEB_LOGIN: (state: AuthState, payload: AuthShowWebLoginPayload): AuthState => {
    return {
      ...state,
      webLoginUrl: payload.authUrl,
    }
  },
  AUTH_UPDATE_STORE_BIOMETRIC_PREF: (state: AuthState, payload: AuthUpdateStoreTokenWithBioPayload): AuthState => {
    return {
      ...state,
      ...payload,
    }
  },
  AUTH_START_EDIT_EMAIL: (state: AuthState, payload: PersonalInformationStartEditEmailPayload): AuthState => {
    return {
      ...state,
      ...payload,
      loading: true,
      emailSaved: false,
    }
  },
  AUTH_START_SAVE_EMAIL: (state: AuthState, payload: PersonalInformationStartEditEmailPayload): AuthState => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  AUTH_FINISH_EDIT_EMAIL: (state: AuthState, { error }: PersonalInformationFinishEditEmailPayload): AuthState => {
    const emailSaved = !error

    return {
      ...state,
      error,
      loading: false,
      emailSaved,
    }
  },
})
