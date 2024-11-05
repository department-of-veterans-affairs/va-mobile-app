import { QueryClient } from '@tanstack/react-query'

/**
 * Options for which way to store the refresh token
 */
export enum AUTH_STORAGE_TYPE {
  /** Store refresh token with biometric locking */
  BIOMETRIC = 'BIOMETRIC',
  /** Store refresh token without any locking */
  NONE = 'NONE',
}

export type LoginServiceTypes = 'SIS'

export const LoginServiceTypeConstants: {
  SIS: LoginServiceTypes
} = {
  SIS: 'SIS',
}

/**
 * Auth credentials object, what we get back from auth service
 */
export type AuthCredentialData = {
  access_token?: string
  refresh_token?: string
  device_secret?: string
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

export type UserAuthSettings = {
  firstTimeLogin: boolean
  loading: boolean
  loggedIn: boolean
  loggingOut: boolean
  syncing: boolean

  authCredentials?: AuthCredentialData
}

export type UserBiometricsSettings = {
  canStoreWithBiometric: boolean
  displayBiometricsPreferenceScreen: boolean
  shouldStoreWithBiometric: boolean
  supportedBiometric?: string
}

export type handleTokenCallbackParms = {
  url: string
  queryClient: QueryClient
}
