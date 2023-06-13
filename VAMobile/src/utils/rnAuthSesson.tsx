import { NativeModules } from 'react-native'
import { featureEnabled } from 'utils/remoteConfig'
import { isIOS } from 'utils/platform'
import getEnv from 'utils/env'

const RnAuthSession = NativeModules.RNAuthSession
const CustomTabs = NativeModules.CustomTabsIntentModule
const { AUTH_IAM_ENDPOINT, AUTH_SIS_ENDPOINT, AUTH_IAM_CLIENT_ID, AUTH_IAM_REDIRECT_URL, AUTH_IAM_SCOPES } = getEnv()

/**
 * This function fires the native iOS log in system for OAuth and returns a promise with the callback url string to continue log in
 * @returns Promise<string> returns a promise with the callback url for log in with the OAuth exchange code query param
 */
export const startAuthSession = async (codeChallenge: string, stateParam: string): Promise<string> => {
  const SISEnabled = featureEnabled('SIS')
  if (isIOS()) {
    return await RnAuthSession.beginAuthSession(
      SISEnabled ? AUTH_SIS_ENDPOINT : AUTH_IAM_ENDPOINT,
      AUTH_IAM_CLIENT_ID,
      AUTH_IAM_REDIRECT_URL,
      AUTH_IAM_SCOPES,
      codeChallenge,
      stateParam,
      SISEnabled,
    )
  } else {
    console.debug('custom tabs')
    return CustomTabs.openGoogle(
      SISEnabled ? AUTH_SIS_ENDPOINT : AUTH_IAM_ENDPOINT,
      AUTH_IAM_CLIENT_ID,
      AUTH_IAM_REDIRECT_URL,
      AUTH_IAM_SCOPES,
      codeChallenge,
      stateParam,
      SISEnabled,
    )
  }
}
