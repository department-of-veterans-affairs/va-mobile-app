import { useMutation } from '@tanstack/react-query'

import { Events } from 'constants/analytics'
import store from 'store'
import { dispatchUpdateEnablePostLogin, dispatchUpdateLoadingRefreshToken } from 'store/slices'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { clearStoredAuthCreds, finishInitialize, processAuthResponse } from 'utils/auth'
import { isErrorObject } from 'utils/common'
import getEnv from 'utils/env'
import { useAppDispatch } from 'utils/hooks'
import { clearCookies } from 'utils/rnAuthSesson'

import { usePostLoggedIn } from './postLoggedIn'

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
  const { mutate: postLoggedIn } = usePostLoggedIn()
  const dispatch = useAppDispatch()
  return useMutation({
    mutationFn: refreshAccessToken,
    onMutate: () => {
      dispatch(dispatchUpdateLoadingRefreshToken(true))
      clearCookies()
    },
    onSettled: () => {
      dispatch(dispatchUpdateLoadingRefreshToken(false))
    },
    onSuccess: async (data) => {
      const authCredentials = await processAuthResponse(data)
      await finishInitialize(dispatch, true, authCredentials)
      if (store.getState().auth.enablePostLogin) {
        dispatch(dispatchUpdateEnablePostLogin(false))
        postLoggedIn()
      }
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        console.error(error)
        logNonFatalErrorToFirebase(error, `RefreshToken: Auth Service Error`)
        if (error.status) {
          logAnalyticsEvent(Events.vama_login_token_refresh(error))
        }
      }
      finishInitialize(dispatch, false)
      clearStoredAuthCreds()
      dispatch(dispatchUpdateEnablePostLogin(true))
    },
  })
}
