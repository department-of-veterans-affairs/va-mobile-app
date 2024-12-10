import { useMutation } from '@tanstack/react-query'

import { dispatchUpdateLoadingRefreshToken } from 'store/slices'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { clearStoredAuthCreds, processAuthResponse } from 'utils/auth'
import getEnv from 'utils/env'
import { useAppDispatch, useShowActionSheet } from 'utils/hooks'
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
  const dispatch = useAppDispatch()
  const showActionSheet = useShowActionSheet()
  const options = ['cancel']
  return useMutation({
    mutationFn: refreshAccessToken,
    onMutate: () => {
      dispatch(dispatchUpdateLoadingRefreshToken(true))
      clearCookies()
      showActionSheet(
        {
          options,
          cancelButtonIndex: 0,
          title: 'refresh token mutate',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              break
          }
        },
      )
    },
    onSettled: () => {
      dispatch(dispatchUpdateLoadingRefreshToken(false))
      showActionSheet(
        {
          options,
          cancelButtonIndex: 0,
          title: 'refresh token settled',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              break
          }
        },
      )
    },
    onSuccess: (data) => {
      processAuthResponse(data)
      showActionSheet(
        {
          options,
          cancelButtonIndex: 0,
          title: 'refresh token success',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              break
          }
        },
      )
    },
    onError: (error) => {
      showActionSheet(
        {
          options,
          cancelButtonIndex: 0,
          title: 'refresh token error',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              break
          }
        },
      )
      logNonFatalErrorToFirebase(error, `processAuthResponse: Auth Service Error`)
      clearStoredAuthCreds()
    },
  })
}
