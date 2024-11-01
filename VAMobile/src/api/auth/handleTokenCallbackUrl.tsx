import { useMutation } from '@tanstack/react-query'

import { UserAuthSettings, handleTokenCallbackParms } from 'api/types'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { getCodeVerifier, loginFinish, loginStart, parseCallbackUrlParams, processAuthResponse } from 'utils/auth'
import { isErrorObject } from 'utils/common'
import getEnv from 'utils/env'
import { clearCookies } from 'utils/rnAuthSesson'

import { usePostLoggedIn } from './postLoggedIn'
import { authKeys } from './queryKeys'

const { AUTH_SIS_TOKEN_EXCHANGE_URL } = getEnv()

/**
 * Refresh a user access token
 */
const handleTokenCallbackUrl = async (handleTokenCallbackParams: handleTokenCallbackParms): Promise<Response> => {
  const codeVerifier = await getCodeVerifier()
  const { code } = parseCallbackUrlParams(handleTokenCallbackParams.url)
  return fetch(AUTH_SIS_TOKEN_EXCHANGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code_verifier: codeVerifier || '',
      code,
    }).toString(),
  })
}

/**
 * Returns a mutation for refreshing a user access token
 */
export const useHandleTokenCallbackUrl = () => {
  const { mutate: postLoggedIn } = usePostLoggedIn()
  return useMutation({
    mutationFn: handleTokenCallbackUrl,
    onSettled: () => {
      logAnalyticsEvent(Events.vama_auth_completed())
      loginStart(true)
      clearCookies()
    },
    onSuccess: async (data) => {
      const authCredentials = await processAuthResponse(data)
      await loginFinish(false, authCredentials)
      postLoggedIn()
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `handleTokenCallbackUrl: Auth Service Error`)
        if (error.status) {
          logAnalyticsEvent(Events.vama_login_token_fetch(error))
        }
        loginFinish(true)
      }
    },
  })
}
