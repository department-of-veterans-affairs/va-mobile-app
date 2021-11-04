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
 * Redux payload for AUTH_FINISH_LOGIN action
 */
export type AuthFinishLoginPayload = {
  authCredentials?: AuthCredentialData
  error?: Error
}

/**
 * Redux payload for AUTH_SET_AUTHORIZE_REQUEST_PARAMS action
 */
export type AuthSetAuthorizeRequestParamsPayload = {
  codeVerifier: string
  codeChallenge: string
  authorizeStateParam: string
}
