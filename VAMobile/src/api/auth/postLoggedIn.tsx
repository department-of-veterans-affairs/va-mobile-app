import { useMutation } from '@tanstack/react-query'

import { Events } from 'constants/analytics'
import { post } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

/**
 * Post to BE that a user is logged in
 */
const postLoggedIn = (): Promise<Response | undefined> => {
  return post('/v0/user/logged-in')
}

/**
 * Returns a mutation for posting to BE that a user is logged in
 */
export const usePostLoggedIn = () => {
  return useMutation({
    mutationFn: postLoggedIn,
    onSuccess: () => {
      logAnalyticsEvent(Events.vama_login_success(true))
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'logged-in Url: /v0/user/logged-in')
        if (error.status) {
          logAnalyticsEvent(Events.vama_user_call(error.status))
        }
      }
    },
  })
}
