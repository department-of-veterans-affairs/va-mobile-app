import { useQuery } from '@tanstack/react-query'

import { UserAuthSettings } from 'api/types'
import { checkFirstTimeLogin, deviceSupportedBiometrics, isBiometricsPreferred } from 'utils/auth'
import { pkceAuthorizeParams } from 'utils/oauth'

import { authKeys } from './queryKeys'

/**
 * Fetch user Auth Settings
 */
const getAuthSettings = async (): Promise<UserAuthSettings> => {
  const firstTimeLogin = await checkFirstTimeLogin()
  const supportedBiometric = await deviceSupportedBiometrics()
  const biometricsPreferred = await isBiometricsPreferred()
  const { codeVerifier, codeChallenge } = await pkceAuthorizeParams()
  return {
    canStoreWithBiometric: !!supportedBiometric,
    displayBiometricsPreferenceScreen: true,
    firstTimeLogin: firstTimeLogin,
    loading: false,
    loggedIn: false,
    loggingOut: false,
    shouldStoreWithBiometric: biometricsPreferred,
    supportedBiometric: supportedBiometric,
    syncing: false,
    codeVerifier: codeVerifier,
    codeChallenge: codeChallenge,
  }
}

/**
 * Returns a query for user Auth Settings
 */
export const useAuthSettings = () => {
  return useQuery({
    staleTime: Infinity,
    queryKey: authKeys.settings,
    queryFn: () => getAuthSettings(),
    meta: {
      errorName: 'getAuthSettings: Service error',
    },
  })
}
