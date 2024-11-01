import * as Keychain from 'react-native-keychain'

import AsyncStorage from '@react-native-async-storage/async-storage'
import CookieManager from '@react-native-cookies/cookies'
import analytics from '@react-native-firebase/analytics'
import { utils } from '@react-native-firebase/app'
import crashlytics from '@react-native-firebase/crashlytics'
import performance from '@react-native-firebase/perf'

import { UseMutateFunction } from '@tanstack/react-query'

import { authKeys } from 'api/auth'
import queryClient from 'api/queryClient'
import {
  AUTH_STORAGE_TYPE,
  AuthCredentialData,
  LOGIN_PROMPT_TYPE,
  LoginServiceTypeConstants,
  UserAuthSettings,
} from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { EnvironmentTypesConstants } from 'constants/common'
import * as api from 'store/api'
import getEnv from 'utils/env'

import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from './analytics'
import { isAndroid } from './platform'

export const NEW_SESSION = '@store_new_session'
export const FIRST_TIME_LOGIN = '@store_first_time_login'
export const KEYCHAIN_DEVICE_SECRET_KEY = 'vamobileDeviceSecret'

const BIOMETRICS_STORE_PREF_KEY = '@store_creds_bio'
const FIRST_LOGIN_COMPLETED_KEY = '@store_first_login_complete'
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
    const options: Keychain.Options = {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    }
    await storeRefreshToken(refreshToken, options, AUTH_STORAGE_TYPE.BIOMETRIC)
    // In development environment, allow saving refresh token/unlock without biometrics
  } else if (__DEV__) {
    const options: Keychain.Options = {
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
  options: Keychain.Options,
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
 * Action to check if this is the first time a user has logged in
 */

export const checkFirstTimeLogin = async (): Promise<boolean> => {
  const isFirstLogin = !(await AsyncStorage.getItem(FIRST_LOGIN_COMPLETED_KEY))
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
  await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, firstTimeLogin: false })
}

export const setBiometricsPreference = async (value: boolean) => {
  await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, value ? AUTH_STORAGE_TYPE.BIOMETRIC : AUTH_STORAGE_TYPE.NONE)
  const refreshToken = await retrieveRefreshToken()
  await saveRefreshToken(refreshToken || '')
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, shouldStoreWithBiometric: value })
  await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(value))
}

export const debugResetFirstTimeLogin = async (logout: UseMutateFunction<Response, Error, void, void>) => {
  await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, '')
  await logout()
  await setBiometricsPreference(false)
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, firstTimeLogin: true })
}

/**
 * Sets the flag used to determine if the biometrics preference screen should be displayed
 */
export const setDisplayBiometricsPreferenceScreen = (value: boolean) => {
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, displayBiometricsPreferenceScreen: value })
}

/**
 * Signal the sync process is completed
 */
export const completeSync = () => {
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, { ...userSettings, syncing: false })
}

export const finishInitialize = async (loggedIn: boolean, authCredentials?: AuthCredentialData) => {
  // check if staging or Google Pre-Launch test, staging or test and turn off analytics if that is the case
  if (utils().isRunningInTestLab || ENVIRONMENT === EnvironmentTypesConstants.Staging || __DEV__ || IS_TEST) {
    await crashlytics().setCrashlyticsCollectionEnabled(false)
    await analytics().setAnalyticsCollectionEnabled(false)
    await performance().setPerformanceCollectionEnabled(false)
  }
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
    loggedIn: loggedIn,
    syncing: userSettings?.syncing && loggedIn,
    authCredentials: authCredentials,
  })
}

export const loginStart = async (syncing: boolean) => {
  await logAnalyticsEvent(Events.vama_login_start(true, false))
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
    loading: true,
    syncing: syncing,
  })
}

export const loginFinish = async (isError: boolean, authCredentials?: AuthCredentialData) => {
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
    authCredentials: authCredentials,
    loading: isError,
    loggedIn: !isError,
    syncing: userSettings?.syncing && !isError,
  })
}

export const logoutStart = async () => {
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  queryClient.setQueryData(authKeys.settings, {
    ...userSettings,
    loggingOut: true,
    syncing: true,
  })
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

export const initializeAuth = async (refreshAccessToken: () => void) => {
  const pType = await getAuthLoginPromptType()

  if (pType === LOGIN_PROMPT_TYPE.UNLOCK) {
    await finishInitialize(false)
    await startBiometricsLogin(refreshAccessToken)
    return
  } else {
    const refreshToken = await retrieveRefreshToken()
    if (refreshToken) {
      await refreshAccessToken()
    } else {
      await clearStoredAuthCreds()
      await finishInitialize(false)
    }
  }
}

const startBiometricsLogin = async (refreshAccessToken: () => void) => {
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  if (userSettings.loading) {
    return
  }
  await logAnalyticsEvent(Events.vama_login_start(true, true))
  AsyncStorage.setItem(NEW_SESSION, 'true')
  try {
    const refreshToken = await retrieveRefreshToken()
    if (refreshToken) {
      loginStart(true)
      await refreshAccessToken()
    } else {
      await finishInitialize(false)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
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
    const options: Keychain.Options = {
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
