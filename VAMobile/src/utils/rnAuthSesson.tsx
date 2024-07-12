import { NativeModules } from 'react-native'

import getEnv from 'utils/env'
import { isIOS } from 'utils/platform'

const RnAuthSession = NativeModules.RNAuthSession
const CustomTabs = NativeModules.CustomTabsIntentModule
const { AUTH_SIS_ENDPOINT } = getEnv()

/**
 * This function fires the native iOS ASWebAuthenticationSession and Custom Tabs
 * in the case of Android
 * @returns Promise<string> For iOS, returns a promise with the callback
 * url for log in with the OAuth exchange code query param.
 */
export const startAuthSession = async (codeChallenge: string): Promise<string> => {
  if (isIOS()) {
    return await RnAuthSession.beginAuthSession(AUTH_SIS_ENDPOINT, codeChallenge)
  } else {
    return await CustomTabs.beginAuthSession(AUTH_SIS_ENDPOINT, codeChallenge)
  }
}

export const clearCookies = async (): Promise<boolean> => {
  if (isIOS()) {
    return await RnAuthSession.clearCookies()
  } else {
    return await CustomTabs.clearCookies()
  }
}
