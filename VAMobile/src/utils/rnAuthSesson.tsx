import { NativeModules } from 'react-native'
import { isIOS } from './platform'
import getEnv from 'utils/env'

const RnAuthSession = NativeModules.RNAuthSession
const { AUTH_ENDPOINT, AUTH_CLIENT_ID, AUTH_REDIRECT_URL, AUTH_SCOPES } = getEnv()

const customTabs = NativeModules.CustomTabsIntentModule
/**
 * This function fires the native iOS log in system for OAuth and returns a promise with the callback url string to continue log in
 * @returns Promise<string> returns a promise with the callback url for log in with the OAuth exchange code query param
 */
export const startAuthSession = async (codeChallenge: string, stateParam: string): Promise<string> => {
  if (isIOS()) {
    return await RnAuthSession.beginAuthSession(AUTH_ENDPOINT, AUTH_CLIENT_ID, AUTH_REDIRECT_URL, AUTH_SCOPES, codeChallenge, stateParam)
  } else {
    return customTabs.openGoogle(AUTH_ENDPOINT, AUTH_CLIENT_ID, AUTH_REDIRECT_URL, AUTH_SCOPES, codeChallenge, stateParam)
  }
}
