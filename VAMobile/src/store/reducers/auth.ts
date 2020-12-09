import { AuthCredentialData, LOGIN_PROMPT_TYPE } from 'store/types'
import createReducer from './createReducer'

export type AuthState = {
  loading: boolean
  initializing: boolean
  error?: Error
  loggedIn: boolean
  loginPromptType?: LOGIN_PROMPT_TYPE
  webLoginUrl?: string
  authCredentials?: AuthCredentialData
  canStoreWithBiometric?: boolean
  shouldStoreWithBiometric?: boolean
  supportedBiometric?: string
}

export const initialAuthState: AuthState = {
  loading: false,
  initializing: true,
  loggedIn: false,
}

const initialState = initialAuthState

export default createReducer<AuthState>(initialState, {
  AUTH_INITIALIZE: (_state, payload) => {
    return {
      ...initialState,
      ...payload,
      initializing: false,
      loggedIn: payload.loggedIn,
    }
  },
  AUTH_START_LOGIN: (_state, payload) => {
    return {
      ...initialState,
      ...payload,
      initializing: false,
      loading: true,
    }
  },
  AUTH_FINISH_LOGIN: (state, payload) => {
    return {
      ...state,
      ...payload,
      webLoginUrl: undefined,
      loading: false,
      loggedIn: !payload.error,
    }
  },
  AUTH_SHOW_WEB_LOGIN: (state, payload) => {
    return {
      ...state,
      webLoginUrl: payload.authUrl,
    }
  },
  AUTH_UPDATE_STORE_BIOMETRIC_PREF: (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
})
