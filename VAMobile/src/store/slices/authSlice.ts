import * as Keychain from 'react-native-keychain'

import AsyncStorage from '@react-native-async-storage/async-storage'
import analytics from '@react-native-firebase/analytics'
import { utils } from '@react-native-firebase/app'
import crashlytics from '@react-native-firebase/crashlytics'
import performance from '@react-native-firebase/perf'

import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import queryClient from 'api/queryClient'
import { Events, UserAnalytics } from 'constants/analytics'
import { EnvironmentTypesConstants } from 'constants/common'
import { AppDispatch, AppThunk } from 'store'
import * as api from 'store/api'
import {
  AUTH_STORAGE_TYPE,
  AuthCredentialData,
  AuthFinishLoginPayload,
  AuthInitializePayload,
  AuthParamsLoadingStateTypeConstants,
  AuthParamsLoadingStateTypes,
  AuthSetAuthorizeRequestParamsPayload,
  LOGIN_PROMPT_TYPE,
  LoginServiceTypeConstants,
} from 'store/api/types'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { KEYCHAIN_DEVICE_SECRET_KEY, storeDeviceSecret } from 'utils/auth'
import { isErrorObject } from 'utils/common'
import getEnv from 'utils/env'
import { pkceAuthorizeParams } from 'utils/oauth'
import { isAndroid } from 'utils/platform'
import { clearCookies } from 'utils/rnAuthSesson'

import { dispatchSetAnalyticsLogin } from './analyticsSlice'
import { updateDemoMode } from './demoSlice'

const {
  AUTH_SIS_ENDPOINT,
  AUTH_SIS_REVOKE_URL,
  AUTH_SIS_TOKEN_EXCHANGE_URL,
  AUTH_SIS_TOKEN_REFRESH_URL,
  ENVIRONMENT,
  IS_TEST,
} = getEnv()

let inMemoryRefreshToken: string | undefined

export const NEW_SESSION = '@store_new_session'
export const FIRST_TIME_LOGIN = '@store_first_time_login'

const BIOMETRICS_STORE_PREF_KEY = '@store_creds_bio'
const REFRESH_TOKEN_ENCRYPTED_COMPONENT_KEY = '@store_refresh_token_encrypted_component'
const FIRST_LOGIN_COMPLETED_KEY = '@store_first_login_complete'
const ANDROID_FIRST_LOGIN_COMPLETED_KEY = '@store_android_first_login_complete'
const NOTIFICATION_COMPLETED_KEY = '@store_notification_preference_complete'
const FIRST_LOGIN_STORAGE_VAL = 'COMPLETE'
const KEYCHAIN_STORAGE_KEY = 'vamobile'
const REFRESH_TOKEN_TYPE = 'refreshTokenType'
const authNonFatalErrorString = 'Auth Service Error'

export type AuthState = {
  loading: boolean
  loadingRefreshToken: boolean
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
  settingBiometricPreference: boolean
  supportedBiometric?: string
  firstTimeLogin: boolean
  showLaoGate: boolean
  displayBiometricsPreferenceScreen: boolean
  codeVerifier?: string
  codeChallenge?: string
  authorizeStateParam?: string
  authParamsLoadingState: AuthParamsLoadingStateTypes
  successfulLogin?: boolean
  requestNotificationsPreferenceScreen?: boolean
  requestNotifications?: boolean
}

export const initialAuthState: AuthState = {
  loading: false,
  loadingRefreshToken: false,
  initializing: true,
  loggedIn: false,
  loggingOut: false,
  syncing: false,
  firstTimeLogin: false,
  canStoreWithBiometric: false,
  shouldStoreWithBiometric: false,
  settingBiometricPreference: false,
  displayBiometricsPreferenceScreen: false,
  showLaoGate: false,
  authParamsLoadingState: AuthParamsLoadingStateTypeConstants.INIT,
  requestNotificationsPreferenceScreen: false,
  requestNotifications: false,
}

/*
Call postLoggedIn to finish login setup on the BE, Success is empty and we don't show anything on failure
*/

const postLoggedIn = async () => {
  try {
    await logAnalyticsEvent(Events.vama_login_success(true))
    await api.post('/v0/user/logged-in')
  } catch (error) {
    if (isErrorObject(error)) {
      logNonFatalErrorToFirebase(error, 'logged-in Url: /v0/user/logged-in')
      if (error.status) {
        await logAnalyticsEvent(Events.vama_user_call(error.status))
      }
    }
  }
}

/**
 * Sets the flag used to determine if the biometrics preference screen should be displayed
 */
export const setDisplayBiometricsPreferenceScreen =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetDisplayBiometricsPreferenceScreen(value))
  }

export const setNotificationsPreferenceScreen =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetNotificationsPreferenceScreen(value))
  }

export const setRequestNotifications =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetRequestNotifications(value))
  }

/**
 * Signal the sync process is completed
 */
export const completeSync = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishSync())
}

/**
 * Sets the flag used to determine if this is the first time a user has logged into the app
 */
export const completeFirstTimeLogin = (): AppThunk => async (dispatch) => {
  if (isAndroid()) {
    AsyncStorage.setItem(ANDROID_FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
    dispatch(dispatchSetFirstLogin(false))
  } else {
    await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
    dispatch(dispatchSetFirstLogin(false))
  }
}

/**
 * Clears auth credentials
 */
const clearStoredAuthCreds = async (): Promise<void> => {
  await Keychain.resetInternetCredentials({ server: KEYCHAIN_STORAGE_KEY })
  await Keychain.resetInternetCredentials({ server: KEYCHAIN_DEVICE_SECRET_KEY })
  await AsyncStorage.removeItem(REFRESH_TOKEN_TYPE)
  inMemoryRefreshToken = undefined
}

/**
 * Action to check if this is the first time a user has logged in
 */

export const checkFirstTimeLogin = (): AppThunk => async (dispatch) => {
  if (IS_TEST) {
    // In integration tests this will change the behavior and make it inconsistent across runs
    dispatch(dispatchSetFirstLogin(false))
    return
  }
  let isFirstLogin = true
  // if we need to 'retrigger' onboarding for existing users in the future we should just increment
  // the AsyncStorage 'completed key' with a #.
  if (isAndroid()) {
    const firstLoginCompletedVal = await AsyncStorage.getItem(ANDROID_FIRST_LOGIN_COMPLETED_KEY)
    console.debug(`checkFirstTimeLogin: first time login is ${!firstLoginCompletedVal}`)
    isFirstLogin = !firstLoginCompletedVal
  } else {
    const firstLoginCompletedVal = await AsyncStorage.getItem(FIRST_LOGIN_COMPLETED_KEY)
    console.debug(`checkFirstTimeLogin: first time login is ${!firstLoginCompletedVal}`)
    isFirstLogin = !firstLoginCompletedVal
  }

  // On the first sign in, clear any stored credentials from previous installs
  if (isFirstLogin) {
    await clearStoredAuthCreds()
  }
  dispatch(dispatchSetFirstLogin(isFirstLogin))
}

export const checkRequestNotificationsPreferenceScreen = (): AppThunk => async (dispatch) => {
  if (IS_TEST) {
    // In integration tests this will change the behavior and make it inconsistent across runs
    dispatch(dispatchSetNotificationsPreferenceScreen(false))
    return
  }

  const setNotificationsPreferenceScreenVal = await AsyncStorage.getItem(NOTIFICATION_COMPLETED_KEY)
  console.debug(`checkRequestNotificationPreferenceScreen: is ${!setNotificationsPreferenceScreenVal}`)

  const shouldShowScreen = !setNotificationsPreferenceScreenVal
  dispatch(dispatchSetNotificationsPreferenceScreen(shouldShowScreen))
}

/**
 * Gets the device supported biometrics
 */
const deviceSupportedBiometrics = async (): Promise<string> => {
  const supportedBiometric = await Keychain.getSupportedBiometryType()
  console.debug(`deviceSupportedBiometrics:${supportedBiometric}`)
  return supportedBiometric || ''
}

/**
 * Checks if biometric is preferred
 */
const isBiometricsPreferred = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(BIOMETRICS_STORE_PREF_KEY)
    console.debug(`shouldStoreWithBiometrics: BIOMETRICS_STORE_PREF_KEY=${value}`)
    if (value) {
      const shouldStore = value === AUTH_STORAGE_TYPE.BIOMETRIC
      console.debug('shouldStoreWithBiometrics: shouldStore with biometrics: ' + shouldStore)
      return shouldStore
    } else {
      console.debug('shouldStoreWithBiometrics: BIOMETRICS_STORE_PREF_KEY: no stored preference for auth found')
    }
  } catch (e) {
    logNonFatalErrorToFirebase(e, `isBiometricsPreferred: ${authNonFatalErrorString}`)
    // if we get an exception here assume there is no preference
    // and go with the default case, log the error and continue
    console.error(e)
  }

  return false
}

export const setPKCEParams = (): AppThunk => async (dispatch) => {
  dispatch(dispatchStartAuthorizeParams())
  const { codeVerifier, codeChallenge, stateParam } = await pkceAuthorizeParams()
  console.debug('PKCE params: ', codeVerifier, codeChallenge, stateParam)
  dispatch(dispatchStoreAuthorizeParams({ codeVerifier, codeChallenge, authorizeStateParam: stateParam }))
}

export const loginStart =
  (syncing: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(sendLoginStartAnalytics(false))
    dispatch(dispatchStartAuthLogin(syncing))
  }

const finishInitialize = async (
  dispatch: AppDispatch,
  loginPromptType: LOGIN_PROMPT_TYPE,
  loggedIn: boolean,
  authCredentials?: AuthCredentialData,
): Promise<void> => {
  const supportedBiometric = await deviceSupportedBiometrics()

  // if undefined we assume save with biometrics (first time through)
  // only set shouldSave to false when user specifically sets that in user settings
  const biometricsPreferred = await isBiometricsPreferred()
  const canSaveWithBiometrics = !!supportedBiometric
  const payload = {
    loginPromptType,
    authCredentials,
    canStoreWithBiometric: canSaveWithBiometrics,
    shouldStoreWithBiometric: biometricsPreferred,
    supportedBiometric: supportedBiometric,
    loggedIn,
  }

  // check if staging or Google Pre-Launch test, staging or test and turn off analytics if that is the case
  if (utils().isRunningInTestLab || ENVIRONMENT === EnvironmentTypesConstants.Staging || __DEV__ || IS_TEST) {
    await crashlytics().setCrashlyticsCollectionEnabled(false)
    await analytics().setAnalyticsCollectionEnabled(false)
    await performance().setPerformanceCollectionEnabled(false)
  }

  dispatch(dispatchInitializeAction(payload))
}

const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  inMemoryRefreshToken = refreshToken
  const canSaveWithBiometrics = !!(await deviceSupportedBiometrics())
  const biometricsPreferred = await isBiometricsPreferred()
  const saveWithBiometrics = canSaveWithBiometrics && biometricsPreferred

  await setAnalyticsUserProperty(UserAnalytics.vama_biometric_device(canSaveWithBiometrics))

  if (!canSaveWithBiometrics) {
    // Since we don't call setBiometricsPreference if it is not supported, send the usage property analytic here
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(false))
  }

  console.debug(`saveRefreshToken: canSaveWithBio:${canSaveWithBiometrics}, saveWithBiometrics:${saveWithBiometrics}`)

  // no matter what reset first, otherwise might hit an exception if changing access types from previously saved
  await Keychain.resetInternetCredentials({ server: KEYCHAIN_STORAGE_KEY })
  if (saveWithBiometrics) {
    // user opted to store with biometrics
    const options: Keychain.SetOptions = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
      storage: Keychain.STORAGE_TYPE.AES_GCM,
    }
    console.debug('saveRefreshToken:', options)
    console.debug('saveRefreshToken: saving refresh token to keychain')
    try {
      await storeRefreshToken(refreshToken, options, AUTH_STORAGE_TYPE.BIOMETRIC)
    } catch (err) {
      logNonFatalErrorToFirebase(err, `saveRefreshTokenWithBiometrics: ${authNonFatalErrorString}`)
      console.error(err)
    }
    // In development environment, allow saving refresh token/unlock without biometrics
  } else if (__DEV__) {
    console.debug('saveRefreshToken: saving non biometric protected')
    const options: Keychain.SetOptions = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }
    console.debug('saveRefreshToken:', options)
    console.debug('saveRefreshToken: saving refresh token to keychain')
    try {
      await storeRefreshToken(refreshToken, options, AUTH_STORAGE_TYPE.NONE)
    } catch (err) {
      logNonFatalErrorToFirebase(err, `saveRefreshTokenWithoutBiometrics: ${authNonFatalErrorString}`)
      console.error(err)
    }
  } else {
    await Keychain.resetInternetCredentials({ server: KEYCHAIN_STORAGE_KEY })
    // NO SAVING THE TOKEN KEEP IN MEMORY ONLY!
    await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
    console.debug('saveRefreshToken: not saving refresh token')
  }
}

/**
 * Biometric storage has a max storage size of 384 bytes.  Because our tokens are so long, we will split the token into 3 pieces,
 * and store just the nonce using biometric storage.  The rest of the token will be stored using AsyncStorage
 */
const storeRefreshToken = async (
  refreshToken: string,
  options: Keychain.SetOptions,
  storageType: AUTH_STORAGE_TYPE,
): Promise<void> => {
  const splitToken = refreshToken.split('.')
  await Promise.all([
    Keychain.setInternetCredentials(KEYCHAIN_STORAGE_KEY, 'user', splitToken[1] || '', options),
    AsyncStorage.setItem(REFRESH_TOKEN_ENCRYPTED_COMPONENT_KEY, splitToken[0]),
    AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, storageType),
    AsyncStorage.setItem(REFRESH_TOKEN_TYPE, LoginServiceTypeConstants.SIS),
  ])
    .then(async () => {
      await logAnalyticsEvent(Events.vama_login_token_store(true))
    })
    .catch(async () => {
      await logAnalyticsEvent(Events.vama_login_token_store(false))
    })
}

/**
 * Returns a reconstructed refresh token with the nonce from Keychain and the rest from AsyncStorage
 */
const retrieveRefreshToken = async (dispatch?: AppDispatch): Promise<string | undefined> => {
  let refreshToken
  let attemptCount = 3

  if (dispatch) {
    dispatch(dispatchStartLoadingRefreshToken())
  }

  while (attemptCount > 0) {
    try {
      console.debug('retrieveRefreshToken')
      const tokenArray = await Promise.all([
        AsyncStorage.getItem(REFRESH_TOKEN_ENCRYPTED_COMPONENT_KEY),
        Keychain.getInternetCredentials(KEYCHAIN_STORAGE_KEY),
      ])

      refreshToken =
        tokenArray && tokenArray[0] && tokenArray[1] ? `${tokenArray[0]}.${tokenArray[1].password}.V0` : undefined
      return refreshToken
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      attemptCount -= 1
      if (attemptCount === 0 || error?.message?.includes('Cancel')) {
        throw error
      }
    } finally {
      if (refreshToken) {
        await logAnalyticsEvent(Events.vama_login_token_get(true))
      } else {
        await logAnalyticsEvent(Events.vama_login_token_get(false))
      }
      if (dispatch) {
        dispatch(dispatchFinishLoadingRefreshToken())
      }
    }
  }
}

type StringMap = { [key: string]: string | undefined }
const parseCallbackUrlParams = (url: string): { code: string; state?: string } => {
  const urlParts = url.split('?')
  const query = urlParts[1]
  const queryParts = query?.split('&') || []

  const obj: StringMap = {
    code: undefined,
    status: undefined,
  }

  queryParts.forEach((qpRaw) => {
    const [key, val] = qpRaw.split('=')
    obj[key] = val
  })

  if (!obj.code) {
    throw new Error('invalid callback params')
  }
  return {
    code: obj.code,
    state: obj.state,
  }
}

const processAuthResponse = async (response: Response): Promise<AuthCredentialData> => {
  try {
    if (response.status < 200 || response.status > 399) {
      console.debug('processAuthResponse: non-200 response', response.status)
      console.debug('processAuthResponse:', await response.text())
      throw Error(`${response.status}`)
    }
    const authResponse = (await response.json())?.data as AuthCredentialData
    console.debug('processAuthResponse: Callback handler Success response:', authResponse)
    // TODO: match state param against what is stored in getState().auth.tokenStateParam ?
    // state is not uniformly supported on the token exchange request so may not be necessary
    if (authResponse.refresh_token && authResponse.access_token) {
      await saveRefreshToken(authResponse.refresh_token)
      api.setAccessToken(authResponse.access_token)
      api.setRefreshToken(authResponse.refresh_token)

      if (authResponse.device_secret) {
        await storeDeviceSecret(authResponse.device_secret)
      }

      return authResponse
    }
    throw new Error('No Refresh or Access Token')
  } catch (e) {
    console.error(e)
    logNonFatalErrorToFirebase(e, `processAuthResponse: ${authNonFatalErrorString}`)
    console.debug('processAuthResponse: clearing keychain')
    await clearStoredAuthCreds()
    throw e
  }
}

/**
 * Checks the SIS feature flag and compares it against the type of refresh token stored
 * @returns if the login service we're using matches the the type of token we have stored
 */
export const refreshTokenMatchesLoginService = async (): Promise<boolean> => {
  const tokenType = await AsyncStorage.getItem(REFRESH_TOKEN_TYPE)
  return tokenType === LoginServiceTypeConstants.SIS
}

export const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
  console.debug('refreshAccessToken: Refreshing access token')
  try {
    await clearCookies()

    // If there's a mismatch between the login service of our feature flag and the type of token we have stored, skip refresh and return false
    const tokenMatchesService = await refreshTokenMatchesLoginService()
    if (!tokenMatchesService) {
      console.debug('refreshAccessToken: Token/service mismatch. Logging out.')
      return false
    }

    const response = await fetch(AUTH_SIS_TOKEN_REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
      }).toString(),
    })

    console.debug('refreshAccessToken: completed refresh request')
    await processAuthResponse(response)
    return true
  } catch (err) {
    logNonFatalErrorToFirebase(err, `refreshAccessToken: ${authNonFatalErrorString}`)
    console.error(err)
    return false
  }
}

export const getAuthLoginPromptType = async (): Promise<LOGIN_PROMPT_TYPE | undefined> => {
  try {
    const hasStoredCredentials = await Keychain.hasInternetCredentials({ server: KEYCHAIN_STORAGE_KEY })

    if (!hasStoredCredentials) {
      console.debug('getAuthLoginPromptType: no stored credentials')
      return LOGIN_PROMPT_TYPE.LOGIN
    }
    // we have a credential saved, check if it's saved with biometrics now
    const value = await AsyncStorage.getItem(BIOMETRICS_STORE_PREF_KEY)
    console.debug(`getAuthLoginPromptType: ${value}`)
    if (value === AUTH_STORAGE_TYPE.BIOMETRIC) {
      return LOGIN_PROMPT_TYPE.UNLOCK
    }
    return LOGIN_PROMPT_TYPE.LOGIN
  } catch (err) {
    logNonFatalErrorToFirebase(err, `getAuthLoginPromptType: ${authNonFatalErrorString}`)
    console.debug('getAuthLoginPromptType: Failed to retrieve type from keychain')
    console.error(err)
    return undefined
  }
}

export const attemptIntializeAuthWithRefreshToken = async (
  dispatch: AppDispatch,
  refreshToken: string,
): Promise<void> => {
  try {
    await clearCookies()
    const refreshTokenMatchesLoginType = await refreshTokenMatchesLoginService()

    if (!refreshTokenMatchesLoginType) {
      throw new Error('Refresh token/login service mismatch.  Aborting refresh.')
    }

    const response = await fetch(AUTH_SIS_TOKEN_REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
      }).toString(),
    })
    const authCredentials = await processAuthResponse(response)
    await dispatch(dispatchSetAnalyticsLogin())
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, true, authCredentials)
    postLoggedIn()
  } catch (error) {
    if (isErrorObject(error)) {
      console.error(error)
      logNonFatalErrorToFirebase(error, `attemptIntializeAuthWithRefreshToken: ${authNonFatalErrorString}`)
      await logAnalyticsEvent(Events.vama_login_token_refresh(error))
    }
    // if some error occurs, we need to force them to re-login
    // even if they had a refreshToken saved, since these tokens are one time use
    // if we fail, we just need to get a new one (re-login) and start over
    // TODO we can check to see if we get a specific error for this scenario (refresh token no longer valid) so we may avoid
    // re-login in certain error situations
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
  }
}

export const setBiometricsPreference =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchStartSetBiometricPreference())
    // resave the token with the new preference
    const prefToSet = value ? AUTH_STORAGE_TYPE.BIOMETRIC : AUTH_STORAGE_TYPE.NONE
    await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, prefToSet)

    await saveRefreshToken(inMemoryRefreshToken || '')
    dispatch(dispatchUpdateStoreBiometricsPreference(value))
    dispatch(dispatchFinishSetBiometricPreference())
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(value))
  }

export const logout = (): AppThunk => async (dispatch, getState) => {
  console.debug('logout: logging out')
  dispatch(dispatchStartLogout())

  const { demoMode } = getState().demo

  if (demoMode) {
    dispatch(updateDemoMode(false, true))
  }

  try {
    const token = api.getAccessToken()
    let refreshToken = inMemoryRefreshToken
    if (!refreshToken) {
      refreshToken = await retrieveRefreshToken()
    }

    await clearCookies()
    const tokenMatchesServiceType = await refreshTokenMatchesLoginService()

    if (tokenMatchesServiceType) {
      const deviceSecret = await Keychain.getInternetCredentials(KEYCHAIN_DEVICE_SECRET_KEY)
      const queryString = new URLSearchParams({
        refresh_token: refreshToken ?? '',
        device_secret: deviceSecret ? deviceSecret.password : '',
      }).toString()

      const response = await fetch(AUTH_SIS_REVOKE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: queryString,
      })
      console.debug('logout:', response.status)
      console.debug('logout:', await response.text())
    } else {
      console.debug('logout: login service changed. clearing creds only.')
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, `logout: ${authNonFatalErrorString}`)
  } finally {
    await clearStoredAuthCreds()
    api.setAccessToken(undefined)
    api.setRefreshToken(undefined)
    // we're truly logging out here, so in order to log back in
    // the prompt type needs to be "login" instead of unlock
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
    queryClient.removeQueries()
    dispatch(dispatchFinishLogout())
  }
}

export const debugResetFirstTimeLogin = (): AppThunk => async (dispatch) => {
  await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, '')
  await dispatch(logout())
  await dispatch(setBiometricsPreference(false))
  await dispatch(dispatchSetFirstLogin(true))
  await dispatch(setNotificationsPreferenceScreen(true))
}

export const startBiometricsLogin = (): AppThunk => async (dispatch, getState) => {
  console.debug('startBiometricsLogin: starting')
  await AsyncStorage.setItem(NEW_SESSION, 'true')
  dispatch(sendLoginStartAnalytics(true))
  let refreshToken: string | undefined
  try {
    refreshToken = await retrieveRefreshToken(dispatch)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (isAndroid()) {
      if (err?.message?.indexOf('Cancel') > -1) {
        // cancel
        console.debug('startBiometricsLogin: User canceled biometric login')
        return
      }
    }
    logNonFatalErrorToFirebase(err, `startBiometricsLogin: ${authNonFatalErrorString}`)
    console.debug('startBiometricsLogin: Failed to get generic password from keychain')
    console.error(err)
  }
  console.debug('startBiometricsLogin: finished - refreshToken: ' + !!refreshToken)
  if (!refreshToken) {
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
    return
  }
  if (getState().auth.loading) {
    console.debug('startBiometricsLogin: other operation already logging in, ignoring')
    // already logging in, duplicate effort
    return
  }
  dispatch(dispatchStartAuthLogin(true))
  await attemptIntializeAuthWithRefreshToken(dispatch, refreshToken)
}

export const initializeAuth = (): AppThunk => async (dispatch) => {
  let refreshToken: string | undefined
  await dispatch(checkFirstTimeLogin())
  await dispatch(checkRequestNotificationsPreferenceScreen())
  const pType = await getAuthLoginPromptType()

  if (pType === LOGIN_PROMPT_TYPE.UNLOCK) {
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.UNLOCK, false)
    await dispatch(startBiometricsLogin())
    return
  } else if (pType === undefined) {
    refreshToken = undefined
  } else {
    // if not set to unlock, try to pull credentials immediately
    // if it fails, just means there was nothing there or it was corrupted
    // and we will clear it and show login again
    try {
      refreshToken = await retrieveRefreshToken()
    } catch (err) {
      logNonFatalErrorToFirebase(err, `initializeAuth: ${authNonFatalErrorString}`)
      console.debug('initializeAuth: Failed to get generic password from keychain')
      console.error(err)
      await clearStoredAuthCreds()
    }
  }
  if (!refreshToken) {
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
    return
  }
  await attemptIntializeAuthWithRefreshToken(dispatch, refreshToken)
}

export const handleTokenCallbackUrl =
  (url: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      await logAnalyticsEvent(Events.vama_auth_completed())
      dispatch(dispatchStartAuthLogin(true))
      console.debug('handleTokenCallbackUrl: HANDLING CALLBACK', url)
      const { code } = parseCallbackUrlParams(url)
      // TODO: match state param against what is stored in getState().auth.authorizeStateParam ?
      console.debug('handleTokenCallbackUrl: POST to', AUTH_SIS_TOKEN_EXCHANGE_URL)
      await clearCookies()
      const response = await fetch(AUTH_SIS_TOKEN_EXCHANGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code_verifier: getState().auth.codeVerifier ?? '',
          code,
        }).toString(),
      })
      const authCredentials = await processAuthResponse(response)
      await dispatch(dispatchSetAnalyticsLogin())
      dispatch(dispatchFinishAuthLogin({ authCredentials }))
      postLoggedIn()
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `handleTokenCallbackUrl: ${authNonFatalErrorString}`)
        await logAnalyticsEvent(Events.vama_login_token_fetch(error))

        dispatch(dispatchFinishAuthLogin({ error }))
      }
    }
  }

export const cancelWebLogin = (): AppThunk => async (dispatch) => {
  await logAnalyticsEvent(Events.vama_login_closed(true))
  dispatch(dispatchShowWebLogin())
}

export const sendLoginFailedAnalytics =
  (error: Error): AppThunk =>
  async () => {
    await logAnalyticsEvent(Events.vama_login_fail(error, true))
  }

export const sendLoginStartAnalytics =
  (biometric: boolean): AppThunk =>
  async () => {
    await logAnalyticsEvent(Events.vama_login_start(true, biometric))
  }

export const startWebLogin = (): AppThunk => async (dispatch) => {
  await clearCookies()
  // TODO: modify code challenge and state based on
  // what will be used in LoginSuccess.js for the token exchange.
  // The code challenge is a SHA256 hash of the code verifier string.
  const params = new URLSearchParams({
    code_challenge_method: 'S256',
    code_challenge: 'tDKCgVeM7b8X2Mw7ahEeSPPFxr7TGPc25IV5ex0PvHI',
    application: 'vamobile',
    oauth: 'true',
  }).toString()

  const url = `${AUTH_SIS_ENDPOINT}?${params}`
  dispatch(dispatchShowWebLogin(url))
}

export const logInDemoMode = (): AppThunk => async (dispatch) => {
  dispatch(dispatchDemoLogin())
}

/**
 * Redux slice that will create the actions and reducers
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    dispatchInitializeAction: (state, action: PayloadAction<AuthInitializePayload>) => {
      const { loggedIn } = action.payload
      return {
        ...initialAuthState,
        ...action.payload,
        initializing: false,
        syncing: state.syncing && loggedIn,
        firstTimeLogin: state.firstTimeLogin,
        loggedIn: loggedIn,
        displayBiometricsPreferenceScreen: true,
        requestNotificationsPreferenceScreen: state.requestNotificationsPreferenceScreen,
      }
    },
    dispatchSetDisplayBiometricsPreferenceScreen: (state, action: PayloadAction<boolean>) => {
      state.displayBiometricsPreferenceScreen = action.payload
    },
    dispatchSetNotificationsPreferenceScreen: (state, action: PayloadAction<boolean>) => {
      state.requestNotificationsPreferenceScreen = action.payload
    },
    dispatchSetRequestNotifications: (state, action: PayloadAction<boolean>) => {
      state.requestNotifications = action.payload
    },
    dispatchSetFirstLogin: (state, action: PayloadAction<boolean>) => {
      state.firstTimeLogin = action.payload
    },
    dispatchFinishSync: (state) => {
      state.syncing = false
    },
    dispatchUpdateStoreBiometricsPreference: (state, action: PayloadAction<boolean>) => {
      state.shouldStoreWithBiometric = action.payload
    },
    dispatchStartAuthLogin: (state, action: PayloadAction<boolean>) => {
      return {
        ...initialAuthState,
        canStoreWithBiometric: state.canStoreWithBiometric,
        shouldStoreWithBiometric: state.shouldStoreWithBiometric,
        supportedBiometric: state.supportedBiometric,
        initializing: false,
        loading: true,
        syncing: action.payload,
        firstTimeLogin: state.firstTimeLogin,
        displayBiometricsPreferenceScreen: true,
        codeVerifier: state.codeVerifier,
        codeChallenge: state.codeChallenge,
        authorizeStateParam: state.authorizeStateParam,
        authParamsLoadingState: state.authParamsLoadingState,
        requestNotificationsPreferenceScreen: state.requestNotificationsPreferenceScreen,
      }
    },
    dispatchFinishAuthLogin: (state, action: PayloadAction<AuthFinishLoginPayload>) => {
      const successfulLogin = !action.payload.error

      return {
        ...(action.payload.error ? initialAuthState : state),
        ...action.payload,
        webLoginUrl: undefined,
        ...(action.payload.error ? { initializing: false } : { loading: false }),
        successfulLogin: successfulLogin,
        loggedIn: successfulLogin,
      }
    },
    dispatchShowWebLogin: (state, action: PayloadAction<string | undefined>) => {
      state.webLoginUrl = action.payload
    },
    dispatchStartAuthorizeParams: (state) => {
      state.authParamsLoadingState = AuthParamsLoadingStateTypeConstants.LOADING
    },
    dispatchStoreAuthorizeParams: (state, action: PayloadAction<AuthSetAuthorizeRequestParamsPayload>) => {
      const { codeVerifier, codeChallenge, authorizeStateParam } = action.payload
      state.codeVerifier = codeVerifier
      state.codeChallenge = codeChallenge
      state.authorizeStateParam = authorizeStateParam
      state.authParamsLoadingState = AuthParamsLoadingStateTypeConstants.READY
    },
    dispatchDemoLogin: (state) => {
      state.loggedIn = true
      state.successfulLogin = true
      state.webLoginUrl = undefined
      state.loading = false
    },
    dispatchStartLogout: (state) => {
      state.syncing = true
      state.loggingOut = true
    },
    dispatchFinishLogout: (state) => {
      state.syncing = false
      state.loggingOut = false
    },
    dispatchStartSetBiometricPreference: (state) => {
      state.settingBiometricPreference = true
    },
    dispatchFinishSetBiometricPreference: (state) => {
      state.settingBiometricPreference = false
    },
    dispatchStartLoadingRefreshToken: (state) => {
      state.loadingRefreshToken = true
    },
    dispatchFinishLoadingRefreshToken: (state) => {
      state.loadingRefreshToken = false
    },
  },
})

export const {
  dispatchInitializeAction,
  dispatchSetDisplayBiometricsPreferenceScreen,
  dispatchSetNotificationsPreferenceScreen,
  dispatchSetRequestNotifications,
  dispatchSetFirstLogin,
  dispatchFinishSync,
  dispatchUpdateStoreBiometricsPreference,
  dispatchStartAuthorizeParams,
  dispatchStoreAuthorizeParams,
  dispatchStartAuthLogin,
  dispatchFinishAuthLogin,
  dispatchShowWebLogin,
  dispatchDemoLogin,
  dispatchFinishLogout,
  dispatchStartLogout,
  dispatchStartSetBiometricPreference,
  dispatchFinishSetBiometricPreference,
  dispatchStartLoadingRefreshToken,
  dispatchFinishLoadingRefreshToken,
} = authSlice.actions

export default authSlice.reducer
