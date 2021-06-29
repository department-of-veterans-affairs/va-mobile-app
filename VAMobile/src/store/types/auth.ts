import { ActionDef } from './index'
/**
 * Options for which way to store the refresh token
 */
export enum AUTH_STORAGE_TYPE {
  /** Store refresh token with biometric locking */
  BIOMETRIC = 'BIOMETRIC',
  /** Store refresh token without any locking */
  NONE = 'NONE',
}

export type AuthParamsLoadingStateTypes = 'init' | 'loading' | 'ready'

export const AuthParamsLoadingStateTypeConstants: {
  INIT: AuthParamsLoadingStateTypes
  LOADING: AuthParamsLoadingStateTypes
  READY: AuthParamsLoadingStateTypes
} = {
  INIT: 'init',
  LOADING: 'loading',
  READY: 'ready',
}

/**
 * Auth credentials object, what we get back from auth service
 */
export type AuthCredentialData = {
  access_token?: string
  refresh_token?: string
  accessTokenExpirationDate?: string
  token_type?: string
  id_token?: string
  expires_in?: number
  scope?: string
}

/**
 * Options for how to display the login screen prompt
 */
export enum LOGIN_PROMPT_TYPE {
  /** user is not logged in at all and login button should be shonw */
  LOGIN = 'LOGIN',
  /** user has saved creds but needs to unlock to login, unlock button should be shown */
  UNLOCK = 'UNLOCK',
}

/**
 * Redux payload for AUTH_INITIALIZE action
 */
export type AuthInitializePayload = {
  loginPromptType: LOGIN_PROMPT_TYPE
  authCredentials?: AuthCredentialData
  canStoreWithBiometric: boolean
  shouldStoreWithBiometric: boolean
  loggedIn: boolean
}

/**
 * Redux payload for AUTH_START_LOGIN action
 */
export type AuthStartLoginPayload = { syncing: boolean }

/**
 * Redux payload for AUTH_FINISH_LOGIN action
 */
export type AuthFinishLoginPayload = {
  authCredentials?: AuthCredentialData
  error?: Error
}

/**
 * Redux payload for AUTH_SHOW_WEB_LOGIN action
 */
export type AuthShowWebLoginPayload = {
  authUrl?: string
}

/**
 * Redux payload for AUTH_UPDATE_STORE_BIOMETRIC_PREF action
 */
export type AuthUpdateStoreTokenWithBioPayload = {
  shouldStoreWithBiometric: boolean
}

/**
 * Redux payload for AUTH_SET_FIRST_TIME_LOGIN action
 */
export type AuthSetFirstTimeLoginPayload = {
  firstTimeLogin: boolean
}

/**
 * Redux payload for AUTH_COMPLETE_SYNC action
 */
export type AuthCompleteSyncPayload = Record<string, unknown>

/**
 * Redux payload for AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN action
 */
export type AuthSetDisplayBiometricsPreferenceScreen = {
  displayBiometricsPreferenceScreen: boolean
}

export type AuthSetDemoLoggedIn = Record<string, unknown>

/**
 * Redux payload for AUTH_START_AUTHORIZE_REQUEST_PARAMS action
 */
export type AuthStartAuthorizeRequestParamsPayload = Record<string, unknown>

/**
 * Redux payload for AUTH_SET_AUTHORIZE_REQUEST_PARAMS action
 */
export type AuthSetAuthorizeRequestParamsPayload = {
  codeVerifier: string
  codeChallenge: string
  authorizeStateParam: string
}

export interface AuthActions {
  /** Redux action to initialize authentication */
  AUTH_INITIALIZE: ActionDef<'AUTH_INITIALIZE', AuthInitializePayload>
  /** Redux action to signify access token request started */
  AUTH_START_LOGIN: ActionDef<'AUTH_START_LOGIN', AuthStartLoginPayload>
  /**  Redux action to signify access token request finished */
  AUTH_FINISH_LOGIN: ActionDef<'AUTH_FINISH_LOGIN', AuthFinishLoginPayload>
  /** Redux action to initiate web login */
  AUTH_SHOW_WEB_LOGIN: ActionDef<'AUTH_SHOW_WEB_LOGIN', AuthShowWebLoginPayload>
  /** Redux action to update whether orn ot to store with biometrics */
  AUTH_UPDATE_STORE_BIOMETRIC_PREF: ActionDef<'AUTH_UPDATE_STORE_BIOMETRIC_PREF', AuthUpdateStoreTokenWithBioPayload>
  /** Redux action to update whether this is the first time  */
  AUTH_SET_FIRST_TIME_LOGIN: ActionDef<'AUTH_SET_FIRST_TIME_LOGIN', AuthSetFirstTimeLoginPayload>
  /** Redux action to mark the sync process as completed */
  AUTH_COMPLETE_SYNC: ActionDef<'AUTH_COMPLETE_SYNC', AuthCompleteSyncPayload>
  /** Redux action to update if the biometrics preference screen should be displayed */
  AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN: ActionDef<'AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN', AuthSetDisplayBiometricsPreferenceScreen>
  /** Redux action to update the Demo Mode flag*/
  AUTH_SET_DEMO_LOGGED_IN: ActionDef<'AUTH_SET_DEMO_LOGGED_IN', AuthSetDemoLoggedIn>
  /** Redux action to store OAuth code verifier and state during authorize request */
  AUTH_START_AUTHORIZE_REQUEST_PARAMS: ActionDef<'AUTH_START_AUTHORIZE_REQUEST_PARAMS', AuthStartAuthorizeRequestParamsPayload>
  /** Redux action to store OAuth code verifier and state during authorize request */
  AUTH_SET_AUTHORIZE_REQUEST_PARAMS: ActionDef<'AUTH_SET_AUTHORIZE_REQUEST_PARAMS', AuthSetAuthorizeRequestParamsPayload>
}
