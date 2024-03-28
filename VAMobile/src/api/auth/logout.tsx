import { useMutation, useQueryClient } from '@tanstack/react-query'

import store from 'store'
import * as api from 'store/api'
import { dispatchClearLoadedAppointments, dispatchClearLoadedMessages } from 'store/slices'
import { updateDemoMode } from 'store/slices/demoSlice'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { clearStoredAuthCreds, finishInitialize, logoutFinish, logoutStart, retrieveRefreshToken } from 'utils/auth'
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
  const refreshToken = await retrieveRefreshToken()

  const queryString = new URLSearchParams({ refresh_token: refreshToken ?? '' }).toString()

  return await fetch(AUTH_SIS_REVOKE_URL, {
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
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { demoMode } = store.getState().demo

  return useMutation({
    mutationFn: logout,
    onMutate: async () => {
      await logoutStart(queryClient)
      await clearCookies()
      if (demoMode) {
        dispatch(updateDemoMode(false, true))
      }
    },
    onSettled: async () => {
      await clearStoredAuthCreds()
      api.setAccessToken(undefined)
      api.setRefreshToken(undefined)
      await finishInitialize(false, queryClient)
      dispatch(dispatchClearLoadedAppointments())
      dispatch(dispatchClearLoadedMessages())
      await logoutFinish(queryClient)
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'logout: Service error')
      }
    },
  })
}
