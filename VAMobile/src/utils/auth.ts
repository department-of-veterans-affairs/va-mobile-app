import * as Keychain from 'react-native-keychain'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { AUTH_STORAGE_TYPE, LOGIN_PROMPT_TYPE, LoginServiceTypeConstants } from 'api/types'
import { Events } from 'constants/analytics'

import { logAnalyticsEvent, logNonFatalErrorToFirebase } from './analytics'

const BIOMETRICS_STORE_PREF_KEY = '@store_creds_bio'
const REFRESH_TOKEN_ENCRYPTED_COMPONENT_KEY = '@store_refresh_token_encrypted_component'
const KEYCHAIN_STORAGE_KEY = 'vamobile'
const REFRESH_TOKEN_TYPE = 'refreshTokenType'

/**
 * Biometric storage has a max storage size of 384 bytes.  Because our tokens are so long, we will split the token into 3 pieces,
 * and store just the nonce using biometric storage.  The rest of the token will be stored using AsyncStorage
 */
export const storeRefreshToken = async (
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
