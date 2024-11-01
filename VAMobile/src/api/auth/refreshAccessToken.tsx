import { useMutation } from '@tanstack/react-query'

import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { clearStoredAuthCreds, processAuthResponse } from 'utils/auth'
import getEnv from 'utils/env'
import { clearCookies } from 'utils/rnAuthSesson'

const { AUTH_SIS_TOKEN_REFRESH_URL } = getEnv()

/**
 * Refresh a user access token
 */
const refreshAccessToken = (refreshToken: string): Promise<Response> => {
  return fetch(AUTH_SIS_TOKEN_REFRESH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
    }).toString(),
  })
}

/**
 * Returns a mutation for refreshing a user access token
 */
export const useRefreshAccessToken = () => {
  return useMutation({
    mutationFn: refreshAccessToken,
    onMutate: () => {
      clearCookies()
    },
    onSuccess: (data) => {
      processAuthResponse(data)
    },
    onError: (error) => {
      logNonFatalErrorToFirebase(error, `processAuthResponse: Auth Service Error`)
      clearStoredAuthCreds()
    },
  })
}
