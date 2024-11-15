import * as Keychain from 'react-native-keychain'

import CookieManager from '@react-native-cookies/cookies'

import { Events } from 'constants/analytics'
import * as api from 'store/api'
import getEnv from 'utils/env'

import { logAnalyticsEvent, logNonFatalErrorToFirebase } from './analytics'

const { AUTH_SIS_TOKEN_EXCHANGE_URL } = getEnv()

export const KEYCHAIN_DEVICE_SECRET_KEY = 'vamobileDeviceSecret'
const SSO_COOKIE_NAMES = ['vagov_access_token', 'vagov_anti_csrf_token', 'vagov_info_token']

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
export const storeDeviceSecret = async (deviceSecret: string) => {
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
