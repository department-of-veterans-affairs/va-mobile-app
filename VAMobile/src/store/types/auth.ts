import * as api from '../api'
import { AType, ActionBase } from './index'
/**
 * Options for which way to store the refresh token
 */
export enum AUTH_STORAGE_TYPE {
  /** Store refresh token with biometric locking */
  BIOMETRIC = 'BIOMETRIC',
  /** Store refresh token without any locking */
  NONE = 'NONE',
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
 * Options for how to display the login screen propt
 */
export enum LOGIN_PROMPT_TYPE {
  /** user is not logged in at all and login button should be shonw */
  LOGIN = 'LOGIN',
  /** user has saved creds but needs to unlock to login, unlock button should be shown */
  UNLOCK = 'UNLOCK',
}

/**
 * Redux payload for {@link AuthInitializeAction} action
 */
export type AuthInitializePayload = {
  loginPromptType: LOGIN_PROMPT_TYPE
  profile?: api.UserDataProfile
  authCredentials?: AuthCredentialData
  canStoreWithBiometric: boolean
  shouldStoreWithBiometric: boolean
}
/**
 * Redux action to initialize authentication
 */
export type AuthInitializeAction = ActionBase<'AUTH_INITIALIZE', AuthInitializePayload>

/**
 * Redux payload for {@link AuthStartLoginAction} action
 */
export type AuthStartLoginPayload = {}
/**
 * Redux action to signify access token request started
 */
export type AuthStartLoginAction = ActionBase<'AUTH_START_LOGIN', AuthStartLoginPayload>

/**
 * Redux payload for {@link AuthFinishLoginAction} action
 */
export type AuthFinishLoginPayload = {
  profile?: api.UserDataProfile
  authCredentials?: AuthCredentialData
  error?: Error
}
/**
 * Redux action to signify access token request finished
 */
export type AuthFinishLoginAction = ActionBase<'AUTH_FINISH_LOGIN', AuthFinishLoginPayload>

/**
 * Redux payload for {@link AuthShowWebLoginAction} action
 */
export type AuthShowWebLoginPayload = {
  authUrl?: string
}
/**
 * Redux action to initiate web login
 */
export type AuthShowWebLoginAction = ActionBase<'AUTH_SHOW_WEB_LOGIN', AuthShowWebLoginPayload>

/**
 * Redux payload for {@link AuthUpdateStoreWithBioAction} action
 */
export type AuthUpdateStoreTokenWithBioPayload = {
  shouldStoreWithBiometric: boolean
}
/**
 * Redux action to update whether orn ot to store with biometrics
 */
export type AuthUpdateStoreWithBioAction = ActionBase<'AUTH_UPDATE_STORE_BIOMETRIC_PREF', AuthUpdateStoreTokenWithBioPayload>

// ALL ACTIONS
export type AuthActions =
  | AType<AuthUpdateStoreWithBioAction>
  | AType<AuthShowWebLoginAction>
  | AType<AuthStartLoginAction>
  | AType<AuthFinishLoginAction>
  | AType<AuthInitializeAction>
