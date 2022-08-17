import { NativeModules } from 'react-native'
import { featureEnabled } from 'utils/remoteConfig'
import getEnv from 'utils/env'

const RnAuthSession = NativeModules.RNAuthSession
const { AUTH_IAM_ENDPOINT, AUTH_SIS_ENDPOINT, AUTH_IAM_CLIENT_ID, AUTH_IAM_REDIRECT_URL, AUTH_IAM_SCOPES } = getEnv()

const SIS_ENABLED = featureEnabled('SIS')

/**
 * This function fires the native iOS log in system for OAuth and returns a promise with the callback url string to continue log in
 * @returns Promise<string> returns a promise with the callback url for log in with the OAuth exchange code query param
 */
export const startIosAuthSession = async (codeChallenge: string, stateParam: string): Promise<string> => {
  return await RnAuthSession.beginAuthSession(
    SIS_ENABLED ? AUTH_SIS_ENDPOINT : AUTH_IAM_ENDPOINT,
    AUTH_IAM_CLIENT_ID,
    AUTH_IAM_REDIRECT_URL,
    AUTH_IAM_SCOPES,
    codeChallenge,
    stateParam,
    SIS_ENABLED,
  )
}
