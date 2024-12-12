import { useSelector } from 'react-redux'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { RootState } from 'store'
import * as api from 'store/api'
import { dispatchUpdateEnablePostLogin, dispatchUpdateLoggingOut, dispatchUpdateSyncing } from 'store/slices'
import { DemoState, updateDemoMode } from 'store/slices/demoSlice'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { clearStoredAuthCreds, finishInitialize, retrieveRefreshToken } from 'utils/auth'
import { isErrorObject } from 'utils/common'
import getEnv from 'utils/env'
import { useAppDispatch } from 'utils/hooks'
import { clearCookies } from 'utils/rnAuthSesson'

const { AUTH_SIS_REVOKE_URL } = getEnv()

/**
 * Logout a user
 */
const logout = async () => {
  const token = api.getAccessToken()
  const refreshToken = api.getRefreshToken() || (await retrieveRefreshToken())

  const queryString = new URLSearchParams({ refresh_token: refreshToken ?? '' }).toString()

  return fetch(AUTH_SIS_REVOKE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: queryString,
  })
}

/**
 * Returns a mutation for logging out a user
 */
export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)

  return useMutation({
    mutationFn: logout,
    onMutate: async () => {
      dispatch(dispatchUpdateLoggingOut(true))
      dispatch(dispatchUpdateSyncing(true))
      if (demoMode) {
        dispatch(updateDemoMode(false, true))
      }
    },
    onSettled: async () => {
      await finishInitialize(dispatch, false)
      await clearStoredAuthCreds()
      dispatch(dispatchUpdateLoggingOut(false))
      dispatch(dispatchUpdateEnablePostLogin(true))
      api.setAccessToken(undefined)
      api.setRefreshToken(undefined)
      queryClient.clear()
      await clearCookies()
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'logout: Service error')
      }
    },
  })
}
