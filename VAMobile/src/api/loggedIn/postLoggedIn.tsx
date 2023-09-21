import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { post } from 'store/api'
import { useMutation } from '@tanstack/react-query'

/**
 * Post user logged in
 */
const postLoggedIn = async () => {
  await post('/v0/user/logged-in')
}

/**
 * Returns a mutation for post a user logged in
 */

export const usePostLoggedIn = () => {
  return useMutation({
    mutationFn: postLoggedIn,
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'postLoggedIn: Service error')
      }
    },
  })
}
