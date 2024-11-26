import * as Keychain from 'react-native-keychain'

import AsyncStorage from '@react-native-async-storage/async-storage'
import CookieManager from '@react-native-cookies/cookies'
import analytics from '@react-native-firebase/analytics'
import { utils } from '@react-native-firebase/app'
import crashlytics from '@react-native-firebase/crashlytics'
import performance from '@react-native-firebase/perf'

import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { UseMutateFunction } from '@tanstack/react-query'

import { authKeys } from 'api/auth'
import queryClient from 'api/queryClient'
import {
  AUTH_STORAGE_TYPE,
  AuthCredentialData,
  LOGIN_PROMPT_TYPE,
  LoginServiceTypeConstants,
  UserAuthSettings,
  UserBiometricsSettings,
} from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { EnvironmentTypesConstants } from 'constants/common'
import store, { AppDispatch } from 'store'
import * as api from 'store/api'
import { dispatchUpdateLoading, dispatchUpdateLoggedIn, dispatchUpdateSyncing } from 'store/slices'
import getEnv from 'utils/env'

import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from './analytics'
import { pkceAuthorizeParams } from './oauth'
import { isAndroid } from './platform'

export const NEW_SESSION = '@store_new_session'
export const FIRST_TIME_LOGIN = '@store_first_time_login'
export const KEYCHAIN_DEVICE_SECRET_KEY = 'vamobileDeviceSecret'
export const CODE_VERIFIER = 'code_verifier'

const BIOMETRICS_STORE_PREF_KEY = '@store_creds_bio'
const FIRST_LOGIN_COMPLETED_KEY = '@store_first_login_complete'
const ANDROID_FIRST_LOGIN_COMPLETED_KEY = '@store_android_first_login_complete'
const FIRST_LOGIN_STORAGE_VAL = 'COMPLETE'
const KEYCHAIN_STORAGE_KEY = 'vamobile'
const REFRESH_TOKEN_ENCRYPTED_COMPONENT_KEY = '@store_refresh_token_encrypted_component'
const REFRESH_TOKEN_TYPE = 'refreshTokenType'
const SSO_COOKIE_NAMES = ['vagov_access_token', 'vagov_anti_csrf_token', 'vagov_info_token']

const { AUTH_SIS_TOKEN_EXCHANGE_URL, ENVIRONMENT, IS_TEST } = getEnv()

export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  const canSaveWithBiometrics = !!(await deviceSupportedBiometrics())
  const biometricsPreferred = await isBiometricsPreferred()
  const saveWithBiometrics = canSaveWithBiometrics && biometricsPreferred

  await setAnalyticsUserProperty(UserAnalytics.vama_biometric_device(canSaveWithBiometrics))

  if (!canSaveWithBiometrics) {
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(false))
  }
  // no matter what reset first, otherwise might hit an exception if changing access types from previously saved
  await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
  if (saveWithBiometrics) {
    const options: Keychain.SetOptions = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }
    await storeRefreshToken(refreshToken, options, AUTH_STORAGE_TYPE.BIOMETRIC)
    // In development environment, allow saving refresh token/unlock without biometrics
  } else if (__DEV__) {
    const options: Keychain.SetOptions = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }
    await storeRefreshToken(refreshToken, options, AUTH_STORAGE_TYPE.NONE)
  } else {
    await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
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
export const retrieveRefreshToken = async (): Promise<string | undefined> => {
  const result = await Promise.all([
    AsyncStorage.getItem(REFRESH_TOKEN_ENCRYPTED_COMPONENT_KEY),
    Keychain.getInternetCredentials(KEYCHAIN_STORAGE_KEY),
  ])
  const reconstructedToken = result[0] && result[1] ? `${result[0]}.${result[1].password}.V0` : undefined

  if (reconstructedToken) {
    await logAnalyticsEvent(Events.vama_login_token_get(true))
  } else {
    await logAnalyticsEvent(Events.vama_login_token_get(false))
  }

  return reconstructedToken
}

type StringMap = { [key: string]: string | undefined }
export const parseCallbackUrlParams = (url: string): { code: string; state?: string } => {
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

export const getAuthLoginPromptType = async (): Promise<LOGIN_PROMPT_TYPE | undefined> => {
  try {
    const hasStoredCredentials = await Keychain.hasInternetCredentials(KEYCHAIN_STORAGE_KEY)

    if (!hasStoredCredentials) {
      return LOGIN_PROMPT_TYPE.LOGIN
    }
    // we have a credential saved, check if it's saved with biometrics now
    const value = await AsyncStorage.getItem(BIOMETRICS_STORE_PREF_KEY)
    return value === AUTH_STORAGE_TYPE.BIOMETRIC ? LOGIN_PROMPT_TYPE.UNLOCK : LOGIN_PROMPT_TYPE.LOGIN
  } catch (err) {
    logNonFatalErrorToFirebase(err, `getAuthLoginPromptType: Auth Service Error`)
    return undefined
  }
}

/**
 * Gets the device supported biometrics
 */
export const deviceSupportedBiometrics = async (): Promise<string> => {
  const supportedBiometric = await Keychain.getSupportedBiometryType()
  return supportedBiometric || ''
}

/**
 * Checks if biometric is preferred
 */
export const isBiometricsPreferred = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(BIOMETRICS_STORE_PREF_KEY)
    return value === AUTH_STORAGE_TYPE.BIOMETRIC
  } catch (e) {
    logNonFatalErrorToFirebase(e, `isBiometricsPreferred: Auth Service Error`)
  }

  return false
}

/**
 * Clears auth credentials
 */
export const clearStoredAuthCreds = async (): Promise<void> => {
  await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
  await AsyncStorage.removeItem(REFRESH_TOKEN_TYPE)
}

/**
 * Generates code verifier and challenge, and stores the code verifier in AsyncStorage.
 * The codeChallenge is returned and can be used to start the authorization flow.
 */
export const generateCodeVerifierAndChallenge = async (): Promise<string> => {
  const { codeVerifier, codeChallenge } = await pkceAuthorizeParams()

  // Store the codeVerifier in AsyncStorage, so we can retrieve it later to verify the authorization flow
  await AsyncStorage.setItem(CODE_VERIFIER, codeVerifier)

  // Return the codeChallenge which can be used to start the authorization flow
  return codeChallenge
}

/**
 * Retrieves the codeVerifier from AsyncStorage.
 * The codeVerifier is generated using the pkceAuthorizeParams helper, and is used to verify the authorization flow.
 */
export const getCodeVerifier = async (): Promise<string | null> => {
  const codeVerifier = await AsyncStorage.getItem(CODE_VERIFIER)
  return codeVerifier
}

/**
 * Action to check if this is the first time a user has logged in
 */

export const checkFirstTimeLogin = async (): Promise<boolean> => {
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
  // In integration tests this will change the behavior and make it inconsistent across runs so return false
  if (isFirstLogin && !IS_TEST) {
    await clearStoredAuthCreds()
    return true
  }
  return false
}

/**
 * Sets the flag used to determine if this is the first time a user has logged into the app
 */
export const completeFirstTimeLogin = async () => {
  if (isAndroid()) {
    AsyncStorage.setItem(ANDROID_FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
  } else {
    await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
  }
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, firstTimeLogin: false })
}

export const setBiometricsPreference = async (value: boolean) => {
  await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, value ? AUTH_STORAGE_TYPE.BIOMETRIC : AUTH_STORAGE_TYPE.NONE)
  const refreshToken = await retrieveRefreshToken()
  await saveRefreshToken(refreshToken || '')
  const userSettings = queryClient.getQueryData(authKeys.biometrics) as UserBiometricsSettings
  queryClient.setQueryData(authKeys.biometrics, { ...userSettings, shouldStoreWithBiometric: value })
  await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(value))
}

export const debugResetFirstTimeLogin = async (logout: UseMutateFunction<Response, Error, void, void>) => {
  await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, '')
  await logout()
  await setBiometricsPreference(false)
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, firstTimeLogin: true })
}

export const finishInitialize = async (
  dispatch: AppDispatch,
  loggedIn: boolean,
  authCredentials?: AuthCredentialData,
) => {
  // check if staging or Google Pre-Launch test, staging or test and turn off analytics if that is the case
  if (utils().isRunningInTestLab || ENVIRONMENT === EnvironmentTypesConstants.Staging || __DEV__ || IS_TEST) {
    await crashlytics().setCrashlyticsCollectionEnabled(false)
    await analytics().setAnalyticsCollectionEnabled(false)
    await performance().setPerformanceCollectionEnabled(false)
  }
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
    authCredentials: authCredentials,
  })
  dispatch(dispatchUpdateLoggedIn(loggedIn))
  dispatch(dispatchUpdateSyncing(loggedIn && store.getState().auth.syncing))
}

export const loginStart = async (dispatch: AppDispatch, syncing: boolean) => {
  await logAnalyticsEvent(Events.vama_login_start(true, false))
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
  })
  await dispatch(dispatchUpdateLoading(true))
  await dispatch(dispatchUpdateSyncing(syncing))
}

export const loginFinish = async (dispatch: AppDispatch, isError: boolean, authCredentials?: AuthCredentialData) => {
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
    authCredentials: authCredentials,
  })
  await dispatch(dispatchUpdateLoading(isError))
  await dispatch(dispatchUpdateLoggedIn(!isError))
  await dispatch(dispatchUpdateSyncing(store.getState().auth.syncing && !isError))
}

export const processAuthResponse = async (response: Response): Promise<AuthCredentialData> => {
  try {
    if (response.status < 200 || response.status > 399) {
      throw Error(`${response.status}`)
    }
    const authResponse = (await response.json())?.data as AuthCredentialData
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
    logNonFatalErrorToFirebase(e, `processAuthResponse: Auth Service Error`)
    await clearStoredAuthCreds()
    throw e
  }
}

export const initializeAuth = async (
  dispatch: AppDispatch,
  refreshAccessToken: () => void,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => void,
) => {
  const options = ['close']
  if (store.getState().demo.demoMode) {
    return
  }
  const pType = await getAuthLoginPromptType()
  if (pType === LOGIN_PROMPT_TYPE.UNLOCK) {
    showActionSheetWithOptions(
      {
        title: 'login unlock hit',
        options,
        cancelButtonIndex: 0,
      },
      () => {},
    )
    await finishInitialize(dispatch, false)
    await startBiometricsLogin(dispatch, refreshAccessToken, showActionSheetWithOptions)
    return
  } else {
    const refreshToken = await retrieveRefreshToken()
    if (refreshToken) {
      showActionSheetWithOptions(
        {
          title: 'login refreshing access token hit',
          options,
          cancelButtonIndex: 0,
        },
        () => {},
      )
      await refreshAccessToken()
    } else {
      showActionSheetWithOptions(
        {
          title: 'login clear credentials',
          options,
          cancelButtonIndex: 0,
        },
        () => {},
      )
      await clearStoredAuthCreds()
      await finishInitialize(dispatch, false)
    }
  }
}

const startBiometricsLogin = async (
  dispatch: AppDispatch,
  refreshAccessToken: () => void,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => void,
) => {
  const options = ['close']
  const loading = store.getState().auth.loading
  if (loading) {
    showActionSheetWithOptions(
      {
        title: 'biometrics loading',
        options,
        cancelButtonIndex: 0,
      },
      () => {},
    )
    return
  }
  await logAnalyticsEvent(Events.vama_login_start(true, true))
  AsyncStorage.setItem(NEW_SESSION, 'true')
  try {
    const refreshToken = await retrieveRefreshToken()
    if (refreshToken) {
      showActionSheetWithOptions(
        {
          title: 'refresh token biometrics',
          options,
          cancelButtonIndex: 0,
        },
        () => {},
      )
      loginStart(dispatch, true)
      await refreshAccessToken()
    } else {
      showActionSheetWithOptions(
        {
          title: 'no refresh token biometrics',
          options,
          cancelButtonIndex: 0,
        },
        () => {},
      )
      await finishInitialize(dispatch, false)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    showActionSheetWithOptions(
      {
        title: 'biometrics error',
        options,
        cancelButtonIndex: 0,
      },
      () => {},
    )
    if (isAndroid()) {
      if (err?.message?.indexOf('Cancel') > -1) {
        return
      }
    }
    logNonFatalErrorToFirebase(err, `startBiometricsLogin: Auth Service Error`)
  }
}

/**
 * Fetches SSO cookies and stores them in the CookieManager
 */
export const fetchSSOCookies = async () => {
  try {
    let hasSSOCookies = false
    await CookieManager.clearAll()

    const deviceSecret = await Keychain.getInternetCredentials(KEYCHAIN_DEVICE_SECRET_KEY)
    const response = await fetch(AUTH_SIS_TOKEN_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        subject_token: api.getAccessToken() || '',
        subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        actor_token: deviceSecret ? deviceSecret.password : '',
        actor_token_type: 'urn:x-oath:params:oauth:token-type:device-secret',
        client_id: 'vaweb',
      }).toString(),
    })

    const cookieHeaders = response.headers.get('set-cookie')

    if (cookieHeaders) {
      await CookieManager.setFromResponse(AUTH_SIS_TOKEN_EXCHANGE_URL, cookieHeaders)

      const cookies = await CookieManager.get(AUTH_SIS_TOKEN_EXCHANGE_URL)
      const cookiesArray = Object.values(cookies)
      hasSSOCookies = SSO_COOKIE_NAMES.every((cookieName) => cookiesArray.some((cookie) => cookie.name === cookieName))
    }

    logAnalyticsEvent(Events.vama_sso_cookie_received(hasSSOCookies))
  } catch (error) {
    logNonFatalErrorToFirebase(error, `Error fetching SSO cookies: ${error}`)
  }
}

/**
 * Stores SSO device secret in keychain/keystore
 */
const storeDeviceSecret = async (deviceSecret: string) => {
  try {
    const options: Keychain.SetOptions = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }

    await Keychain.resetInternetCredentials(KEYCHAIN_DEVICE_SECRET_KEY)
    await Keychain.setInternetCredentials(KEYCHAIN_DEVICE_SECRET_KEY, 'user', deviceSecret, options)
    console.debug('Successfully stored SSO device secret')
  } catch (error) {
    logNonFatalErrorToFirebase(error, `storeDeviceSecret: Failed to store SSO device secret`)
  }
}
