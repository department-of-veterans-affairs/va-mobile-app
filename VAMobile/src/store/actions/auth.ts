import * as Keychain from 'react-native-keychain'
import { Action } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CookieManager from '@react-native-community/cookies'
import qs from 'querystringify'

import * as api from 'store/api'
import { AUTH_STORAGE_TYPE, AsyncReduxAction, AuthCredentialData, AuthInitializePayload, LOGIN_PROMPT_TYPE, ReduxAction } from 'store/types'
import { EnvironmentTypesConstants } from '../../constants/common'
import { Events, UserAnalytics } from 'constants/analytics'
import { StoreState } from 'store/reducers'
import { ThunkDispatch } from 'redux-thunk'
import { dispatchClearAuthorizedServices, dispatchProfileLogout } from './personalInformation'
import { dispatchClearLoadedAppointments } from './appointments'
import { dispatchClearLoadedClaimsAndAppeals } from './claimsAndAppeals'
import { dispatchClearLoadedMessages } from './secureMessaging'
import { dispatchDisabilityRatingLogout } from './disabilityRating'
import { dispatchMilitaryHistoryLogout } from './militaryService'
import { dispatchSetAnalyticsLogin } from './analytics'
import { isAndroid } from 'utils/platform'
import { isErrorObject } from 'utils/common'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { pkceAuthorizeParams } from 'utils/oauth'
import { utils } from '@react-native-firebase/app'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'
import getEnv from 'utils/env'

const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_ENDPOINT, AUTH_REDIRECT_URL, AUTH_REVOKE_URL, AUTH_SCOPES, AUTH_TOKEN_EXCHANGE_URL, ENVIRONMENT, IS_TEST } = getEnv()

let inMemoryRefreshToken: string | undefined
type TDispatch = ThunkDispatch<StoreState, undefined, Action<unknown>>

const dispatchInitializeAction = (payload: AuthInitializePayload): ReduxAction => {
  return {
    type: 'AUTH_INITIALIZE',
    payload,
  }
}
export const BIOMETRICS_STORE_PREF_KEY = '@store_creds_bio'
const FIRST_LOGIN_COMPLETED_KEY = '@store_first_login_complete'
const FIRST_LOGIN_STORAGE_VAL = 'COMPLETE'
const KEYCHAIN_STORAGE_KEY = 'vamobile'

const dispatchSetDisplayBiometricsPreferenceScreen = (displayBiometricsPreferenceScreen: boolean): ReduxAction => {
  return {
    type: 'AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN',
    payload: { displayBiometricsPreferenceScreen },
  }
}

/**
 * Sets the flag used to determine if the biometrics preference screen should be displayed
 */
export const setDisplayBiometricsPreferenceScreen = (value: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchSetDisplayBiometricsPreferenceScreen(value))
  }
}

/**
 * dispatch first time login value to the store
 */
const dispatchSetFirstLogin = (firstTimeLogin: boolean): ReduxAction => {
  return {
    type: 'AUTH_SET_FIRST_TIME_LOGIN',
    payload: { firstTimeLogin },
  }
}

/**
 * Dispatch for the sync process being finished
 */
const dispatchFinishSync = (): ReduxAction => {
  return {
    type: 'AUTH_COMPLETE_SYNC',
    payload: {},
  }
}

/**
 * Dispatch for the logout process being started
 */
const dispatchStartLogout = (): ReduxAction => {
  return {
    type: 'AUTH_START_LOGOUT',
    payload: {},
  }
}

/**
 * Dispatch for the logout process being finished
 */
const dispatchFinishLogout = (): ReduxAction => {
  return {
    type: 'AUTH_COMPLETE_LOGOUT',
    payload: {},
  }
}

/**
 * Signal the sync process is completed
 */
export const completeSync = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchFinishSync())
  }
}

/**
 * Sets the flag used to determine if this is the first time a user has logged into the app
 */
export const completeFirstTimeLogin = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
    dispatch(dispatchSetFirstLogin(false))
  }
}

const clearStoredAuthCreds = async (): Promise<void> => {
  await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
  inMemoryRefreshToken = undefined
}

/**
 * Action to check if this is the first time a user has logged in
 */
export const checkFirstTimeLogin = async (dispatch: TDispatch): Promise<void> => {
  if (IS_TEST) {
    // In integration tests this will change the behavior and make it inconsistent across runs
    dispatch(dispatchSetFirstLogin(false))
    return
  }

  const firstLoginCompletedVal = await AsyncStorage.getItem(FIRST_LOGIN_COMPLETED_KEY)
  console.debug(`checkFirstTimeLogin: first time login is ${!firstLoginCompletedVal}`)

  const isFirstLogin = !firstLoginCompletedVal

  // On the first sign in, clear any stored credentials from previous installs
  if (isFirstLogin) {
    await clearStoredAuthCreds()
  }

  dispatch(dispatchSetFirstLogin(isFirstLogin))
}

const deviceSupportedBiometrics = async (): Promise<string> => {
  const supportedBiometric = await Keychain.getSupportedBiometryType()
  console.debug(`deviceSupportedBiometrics:${supportedBiometric}`)
  return supportedBiometric || ''
}

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
    // if we get an exception here assume there is no preference
    // and go with the default case, log the error and continue
    console.error(e)
  }

  return false
}

const dispatchUpdateStoreBiometricsPreference = (shouldStoreWithBiometric: boolean): ReduxAction => {
  return {
    type: 'AUTH_UPDATE_STORE_BIOMETRIC_PREF',
    payload: { shouldStoreWithBiometric },
  }
}

export const dispatchStartAuthLogin = (syncing: boolean): ReduxAction => {
  return {
    type: 'AUTH_START_LOGIN',
    payload: { syncing },
  }
}

export const dispatchFinishAuthLogin = (authCredentials?: AuthCredentialData, error?: Error): ReduxAction => {
  return {
    type: 'AUTH_FINISH_LOGIN',
    payload: { authCredentials, error },
  }
}

const dispatchShowWebLogin = (authUrl?: string): ReduxAction => {
  return {
    type: 'AUTH_SHOW_WEB_LOGIN',
    payload: { authUrl },
  }
}

export const setPKCEParams = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartAuthorizeParams())
    const { codeVerifier, codeChallenge, stateParam } = await pkceAuthorizeParams()
    console.debug('PKCE params: ', codeVerifier, codeChallenge, stateParam)
    dispatch(dispatchStoreAuthorizeParams(codeVerifier, codeChallenge, stateParam))
  }
}

export const dispatchStartAuthorizeParams = (): ReduxAction => {
  return {
    type: 'AUTH_START_AUTHORIZE_REQUEST_PARAMS',
    payload: {},
  }
}

export const dispatchStoreAuthorizeParams = (codeVerifier: string, codeChallenge: string, authorizeStateParam: string): ReduxAction => {
  return {
    type: 'AUTH_SET_AUTHORIZE_REQUEST_PARAMS',
    payload: { codeVerifier, codeChallenge, authorizeStateParam },
  }
}

export const loginStart = (syncing: true): AsyncReduxAction => {
  return async (dispatch) => {
    dispatch(sendLoginStartAnalytics())
    dispatch(dispatchStartAuthLogin(syncing))
  }
}

const finishInitialize = async (dispatch: TDispatch, loginPromptType: LOGIN_PROMPT_TYPE, loggedIn: boolean, authCredentials?: AuthCredentialData): Promise<void> => {
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
  await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
  if (saveWithBiometrics) {
    // user opted to store with biometrics
    const options: Keychain.Options = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }
    console.debug('saveRefreshToken:', options)
    console.debug('saveRefreshToken: saving refresh token to keychain')
    try {
      await Keychain.setInternetCredentials(KEYCHAIN_STORAGE_KEY, 'user', refreshToken, options)
      await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.BIOMETRIC)
    } catch (err) {
      console.error(err)
    }
  } else if (getEnv().AUTH_ALLOW_NON_BIOMETRIC_SAVE === 'true') {
    console.debug('saveRefreshToken: saving non biometric protected')
    const options: Keychain.Options = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }
    console.debug('saveRefreshToken:', options)
    console.debug('saveRefreshToken: saving refresh token to keychain')
    try {
      await Keychain.setInternetCredentials(KEYCHAIN_STORAGE_KEY, 'user', refreshToken, options)
      await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
    } catch (err) {
      console.error(err)
    }
  } else {
    await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
    // NO SAVING THE TOKEN KEEP IN MEMORY ONLY!
    await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
    console.debug('saveRefreshToken: not saving refresh token')
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
    const authResponse = (await response.json()) as AuthCredentialData
    console.debug('processAuthResponse: Callback handler Success response:', authResponse)
    // TODO: match state param against what is stored in getState().auth.tokenStateParam ?
    // state is not uniformly supported on the token exchange request so may not be necessary
    if (authResponse.refresh_token && authResponse.access_token) {
      await saveRefreshToken(authResponse.refresh_token)
      api.setAccessToken(authResponse.access_token)
      api.setRefreshToken(authResponse.refresh_token)
      return authResponse
    }
    throw new Error('No Refresh or Access Token')
  } catch (e) {
    console.error(e)
    console.debug('processAuthResponse: clearing keychain')
    await clearStoredAuthCreds()
    throw e
  }
}

/**
 * Attempt to refresh the users access token.
 *
 * @param refreshToken - token to use to refresh the access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
  console.debug('refreshAccessToken: Refreshing access token')
  try {
    await CookieManager.clearAll()
    const response = await fetch(AUTH_TOKEN_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        grant_type: 'refresh_token',
        client_id: AUTH_CLIENT_ID,
        client_secret: AUTH_CLIENT_SECRET,
        redirect_uri: AUTH_REDIRECT_URL,
        refresh_token: refreshToken,
      }),
    })

    console.debug('refreshAccessToken: completed refresh request')
    await processAuthResponse(response)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const getAuthLoginPromptType = async (): Promise<LOGIN_PROMPT_TYPE | undefined> => {
  try {
    const hasStoredCredentials = await Keychain.hasInternetCredentials(KEYCHAIN_STORAGE_KEY)

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
    console.debug('getAuthLoginPromptType: Failed to retrieve type from keychain')
    console.error(err)
    return undefined
  }
}

export const attempIntializeAuthWithRefreshToken = async (dispatch: TDispatch, refreshToken: string): Promise<void> => {
  try {
    await CookieManager.clearAll()
    const response = await fetch(AUTH_TOKEN_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        grant_type: 'refresh_token',
        client_id: AUTH_CLIENT_ID,
        client_secret: AUTH_CLIENT_SECRET,
        redirect_uri: AUTH_REDIRECT_URL,
        refresh_token: refreshToken,
      }),
    })
    const authCredentials = await processAuthResponse(response)
    await dispatch(dispatchSetAnalyticsLogin())
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, true, authCredentials)
  } catch (err) {
    console.error(err)
    // if some error occurs, we need to force them to re-login
    // even if they had a refreshToken saved, since these tokens are one time use
    // if we fail, we just need to get a new one (re-login) and start over
    // TODO we can check to see if we get a specific error for this scenario (refresh token no longer valid) so we may avoid
    // re-login in certain error situations
    await logAnalyticsEvent(Events.vama_exchange_failed())
    await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
  }
}

/**
 * Update the user preferences to store the refresh token with biometrics
 * @param value - the preference
 */
export const setBiometricsPreference = (value: boolean): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    // resave the token with the new preference
    const prefToSet = value ? AUTH_STORAGE_TYPE.BIOMETRIC : AUTH_STORAGE_TYPE.NONE
    await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, prefToSet)

    await saveRefreshToken(inMemoryRefreshToken || '')
    dispatch(dispatchUpdateStoreBiometricsPreference(value))
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(value))
  }
}

/**
 * Redux action to logout and clear authentication session
 *
 * @returns AsyncReduxAction
 */
export const logout = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    console.debug('logout: logging out')
    dispatch(dispatchStartLogout())
    try {
      await CookieManager.clearAll()
      const response = await fetch(AUTH_REVOKE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${api.getAccessToken()}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({
          token: api.getAccessToken(),
          client_id: AUTH_CLIENT_ID,
          client_secret: AUTH_CLIENT_SECRET,
          redirect_uri: AUTH_REDIRECT_URL,
        }),
      })
      console.debug('logout:', response.status)
      console.debug('logout:', await response.text())
    } finally {
      await clearStoredAuthCreds()
      api.setAccessToken(undefined)
      api.setRefreshToken(undefined)
      // we're truly loging out here, so in order to log back in
      // the prompt type needs to be "login" instead of unlock
      await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
      dispatch(dispatchClearLoadedAppointments())
      dispatch(dispatchClearLoadedMessages())
      dispatch(dispatchClearLoadedClaimsAndAppeals())
      dispatch(dispatchClearAuthorizedServices())
      dispatch(dispatchProfileLogout())
      dispatch(dispatchMilitaryHistoryLogout())
      dispatch(dispatchDisabilityRatingLogout())
      dispatch(dispatchFinishLogout())
    }
  }
}

/**
 * Used to reset the first time login flag for debug/QA purposes
 */
export const debugResetFirstTimeLogin = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, '')
    await dispatch(logout())
    await dispatch(setBiometricsPreference(false))
    await dispatch(dispatchSetFirstLogin(true))
  }
}

/**
 * Redux action to initiate biometric unlock of a saved refresh token
 *
 * @returns AsyncReduxAction
 */
export const startBiometricsLogin = (): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    console.debug('startBiometricsLogin: starting')
    let refreshToken: string | undefined
    try {
      const result = await Keychain.getInternetCredentials(KEYCHAIN_STORAGE_KEY)
      refreshToken = result ? result.password : undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (isAndroid()) {
        if (err?.message?.indexOf('Cancel') > -1) {
          // cancel
          console.debug('startBiometricsLogin: User canceled biometric login')
          return
        }
      }
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
    await attempIntializeAuthWithRefreshToken(dispatch, refreshToken)
  }
}

/**
 * Redux action to initiate auth and attempt to refresh access token
 * with a saved refresh_token if one exists and is not protected by biometric lock
 *
 * @returns AsyncReduxAction
 */
export const initializeAuth = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    let refreshToken: string | undefined
    await checkFirstTimeLogin(dispatch)
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
        const result = await Keychain.getInternetCredentials(KEYCHAIN_STORAGE_KEY)
        refreshToken = result ? result.password : undefined
      } catch (err) {
        console.debug('initializeAuth: Failed to get generic password from keychain')
        console.error(err)
        await clearStoredAuthCreds()
      }
    }
    if (!refreshToken) {
      await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, false)
      return
    }
    await attempIntializeAuthWithRefreshToken(dispatch, refreshToken)
  }
}

/**
 * Redux action to processes the login-success callback url with code and state params
 * to convert to a refresh and access token
 *
 * @param url - the full callback url with the code and state query params
 *
 * @returns AsyncReduxAction
 */
export const handleTokenCallbackUrl = (url: string): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    try {
      await logAnalyticsEvent(Events.vama_auth_completed())
      dispatch(dispatchStartAuthLogin(true))

      console.debug('handleTokenCallbackUrl: HANDLING CALLBACK', url)
      const { code } = parseCallbackUrlParams(url)
      // TODO: match state param against what is stored in getState().auth.authorizeStateParam ?
      console.debug('handleTokenCallbackUrl: POST to', AUTH_TOKEN_EXCHANGE_URL, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET)
      await CookieManager.clearAll()
      const response = await fetch(AUTH_TOKEN_EXCHANGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({
          grant_type: 'authorization_code',
          client_id: AUTH_CLIENT_ID,
          client_secret: AUTH_CLIENT_SECRET,
          code_verifier: getState().auth.codeVerifier,
          code: code,
          // state: stateParam,
          redirect_uri: AUTH_REDIRECT_URL,
        }),
      })
      const authCredentials = await processAuthResponse(response)
      await logAnalyticsEvent(Events.vama_login_success())
      await dispatch(dispatchSetAnalyticsLogin())
      dispatch(dispatchFinishAuthLogin(authCredentials))
    } catch (err) {
      if (isErrorObject(err)) {
        await logAnalyticsEvent(Events.vama_exchange_failed())
        dispatch(dispatchFinishAuthLogin(undefined, err))
      }
    }
  }
}

/**
 * Redux Action to close / cancel the web login flow (hides the webview)
 *
 * @returns AsyncReduxAction
 */
export const cancelWebLogin = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    await logAnalyticsEvent(Events.vama_login_closed())
    dispatch(dispatchShowWebLogin())
  }
}

/**
 * Redux Action to close / cancel the web login flow (hides the webview)
 *
 * @returns AsyncReduxAction
 */
export const sendLoginFailedAnalytics = (error: Error): AsyncReduxAction => {
  return async (): Promise<void> => {
    await logAnalyticsEvent(Events.vama_login_fail(error))
  }
}

/**
 * Redux Action to send login start analytics
 *
 * @returns AsyncReduxAction
 */
export const sendLoginStartAnalytics = (): AsyncReduxAction => {
  return async (): Promise<void> => {
    await logAnalyticsEvent(Events.vama_login_start())
  }
}

/**
 * TODO is this dead code?
 * Redux action to initiate the web login flow by
 * setting the url to display on the login screen
 *
 * @returns AsyncReduxAction
 */
export const startWebLogin = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    await CookieManager.clearAll()
    // TODO: modify code challenge and state based on
    // what will be used in LoginSuccess.js for the token exchange.
    // The code challenge is a SHA256 hash of the code verifier string.
    const params = qs.stringify({
      client_id: AUTH_CLIENT_ID,
      redirect_uri: AUTH_REDIRECT_URL,
      scope: AUTH_SCOPES,
      response_type: 'code',
      response_mode: 'query',
      code_challenge_method: 'S256',
      code_challenge: 'tDKCgVeM7b8X2Mw7ahEeSPPFxr7TGPc25IV5ex0PvHI',
      state: '12345',
    })
    const url = `${AUTH_ENDPOINT}?${params}`
    dispatch(dispatchShowWebLogin(url))
    //Linking.openURL(url)
  }
}

const dispatchDemoLogin = (): ReduxAction => {
  return {
    type: 'AUTH_SET_DEMO_LOGGED_IN',
    payload: {},
  }
}
export const logInDemoMode = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchDemoLogin())
  }
}
