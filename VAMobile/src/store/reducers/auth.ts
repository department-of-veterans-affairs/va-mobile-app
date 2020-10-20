import * as api from '../api'
import {
  AuthCredentialData,
  AuthFinishLoginPayload,
  AuthInitializePayload,
  AuthShowWebLoginPayload,
  AuthStartLoginPayload,
  AuthUpdateStoreTokenWithBioPayload,
  LOGIN_PROMPT_TYPE,
} from 'store/types'
import createReducer from './createReducer'
import { getFormattedPhoneNumber } from 'utils/common'

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
}

export const initialAuthState: AuthState = {
  loading: false,
  initializing: true,
  loggedIn: false,
}

const initialState = initialAuthState

export default createReducer<AuthState>(initialState, {
  AUTH_INITIALIZE: (_state: AuthState, payload: AuthInitializePayload): AuthState => {
    if (payload.profile) {
      const { profile } = payload
      const listOfNameComponents = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean)
      payload.profile.full_name = listOfNameComponents.join(' ').trim()

      if (profile.home_phone) {
        const { home_phone } = profile
        if (home_phone.areaCode && home_phone.phoneNumber) {
          payload.profile.formatted_home_phone = getFormattedPhoneNumber(home_phone.areaCode, home_phone.phoneNumber)
        }
      }

      if (profile.mobile_phone) {
        const { mobile_phone } = profile
        if (mobile_phone.areaCode && mobile_phone.phoneNumber) {
          payload.profile.formatted_mobile_phone = getFormattedPhoneNumber(mobile_phone.areaCode, mobile_phone.phoneNumber)
        }
      }

      if (profile.work_phone) {
        const { work_phone } = profile
        if (work_phone.areaCode && work_phone.phoneNumber) {
          payload.profile.formatted_work_phone = getFormattedPhoneNumber(work_phone.areaCode, work_phone.phoneNumber)
        }
      }

      if (profile.fax_phone) {
        const { fax_phone } = profile
        if (fax_phone.areaCode && fax_phone.phoneNumber) {
          payload.profile.formatted_fax_phone = getFormattedPhoneNumber(fax_phone.areaCode, fax_phone.phoneNumber)
        }
      }
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
})
