import { AuthCredentialData, AuthParamsLoadingStateTypeConstants, AuthParamsLoadingStateTypes, LOGIN_PROMPT_TYPE } from 'store/types'
import createReducer from './createReducer'

export type AuthState = {
  loading: boolean
  initializing: boolean
  syncing: boolean
  error?: Error
  loggedIn: boolean
  loggingOut: boolean
  loginPromptType?: LOGIN_PROMPT_TYPE
  webLoginUrl?: string
  authCredentials?: AuthCredentialData
  canStoreWithBiometric: boolean
  shouldStoreWithBiometric: boolean
  supportedBiometric?: string
  firstTimeLogin: boolean
  showLaoGate: boolean
  displayBiometricsPreferenceScreen: boolean
  codeVerifier?: string
  codeChallenge?: string
  authorizeStateParam?: string
  authParamsLoadingState: AuthParamsLoadingStateTypes
}

export const initialAuthState: AuthState = {
  loading: false,
  initializing: true,
  loggedIn: false,
  loggingOut: false,
  syncing: false,
  firstTimeLogin: false,
  canStoreWithBiometric: false,
  shouldStoreWithBiometric: false,
  displayBiometricsPreferenceScreen: true,
  showLaoGate: false,
  authParamsLoadingState: AuthParamsLoadingStateTypeConstants.INIT,
}

const initialState = initialAuthState

export default createReducer<AuthState>(initialState, {
  AUTH_INITIALIZE: (state, payload) => {
    return {
      ...initialState,
      ...payload,
      initializing: false,
      syncing: state.syncing && payload.loggedIn,
      firstTimeLogin: state.firstTimeLogin,
      loggedIn: payload.loggedIn,
      displayBiometricsPreferenceScreen: true,
    }
  },
  AUTH_START_LOGIN: (state, payload) => {
    return {
      ...initialState,
      canStoreWithBiometric: state.canStoreWithBiometric,
      shouldStoreWithBiometric: state.shouldStoreWithBiometric,
      supportedBiometric: state.supportedBiometric,
      ...payload,
      initializing: false,
      loading: true,
      syncing: payload.syncing,
      firstTimeLogin: state.firstTimeLogin,
      displayBiometricsPreferenceScreen: true,
      codeVerifier: state.codeVerifier,
      codeChallenge: state.codeChallenge,
      authorizeStateParam: state.authorizeStateParam,
      authParamsLoadingState: state.authParamsLoadingState,
    }
  },
  AUTH_FINISH_LOGIN: (state, payload) => {
    const successfulLogin = !payload.error

    return {
      ...state,
      ...payload,
      webLoginUrl: undefined,
      loading: false,
      successfulLogin: successfulLogin,
      loggedIn: successfulLogin,
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
  AUTH_SET_FIRST_TIME_LOGIN: (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
  AUTH_COMPLETE_SYNC: (state, _payload) => {
    return {
      ...state,
      syncing: false,
    }
  },
  AUTH_START_LOGOUT: (state, _payload) => {
    return {
      ...state,
      syncing: true,
      loggingOut: true,
    }
  },
  AUTH_COMPLETE_LOGOUT: (state, _payload) => {
    return {
      ...state,
      syncing: false,
      loggingOut: false,
    }
  },
  AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN: (state, { displayBiometricsPreferenceScreen }) => {
    return {
      ...state,
      displayBiometricsPreferenceScreen,
    }
  },
  AUTH_SET_DEMO_LOGGED_IN: (state, _payload) => {
    return {
      ...state,
      loggedIn: true,
      successfulLogin: true,
      webLoginUrl: undefined,
      loading: false,
    }
  },
  AUTH_START_AUTHORIZE_REQUEST_PARAMS: (state, _payload) => {
    return {
      ...state,
      authParamsLoadingState: AuthParamsLoadingStateTypeConstants.LOADING,
    }
  },
  AUTH_SET_AUTHORIZE_REQUEST_PARAMS: (state, payload) => {
    return {
      ...state,
      ...payload,
      authParamsLoadingState: AuthParamsLoadingStateTypeConstants.READY,
    }
  },
})
