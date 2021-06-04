import { NativeModules } from 'react-native'
import getEnv from 'utils/env'

const RnAuthSession = NativeModules.RNAuthSession
const { AUTH_ENDPOINT, AUTH_CLIENT_ID, AUTH_REDIRECT_URL, AUTH_SCOPES } = getEnv()

/**
 * This function fires the native iOS log in system for OAuth and returns a promise with the callback url string to continue log in
 * @returns Promise<string> returns a promise with the callback url for log in with the OAuth exchange code query param
 */
export const startIosAuthSession = async (): Promise<string> => {
  return await RnAuthSession.beginAuthSession(AUTH_ENDPOINT, AUTH_CLIENT_ID, AUTH_REDIRECT_URL, AUTH_SCOPES, 'tDKCgVeM7b8X2Mw7ahEeSPPFxr7TGPc25IV5ex0PvHI', '12345')
}
