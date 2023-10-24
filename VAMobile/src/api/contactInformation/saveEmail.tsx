import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Params as APIParams, EditResponseData, post, put } from 'store/api'
import { SaveEmailData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'

/**
 * Creates or updates a user's email depending on whether the `id` field is present
 */
const saveEmail = (emailData: SaveEmailData) => {
  const endpoint = '/v0/user/emails'

  if (emailData.id) {
    return put<EditResponseData>(endpoint, emailData as unknown as APIParams)
  }

  return post<EditResponseData>(endpoint, emailData as unknown as APIParams)
}

/**
 * Returns a mutation for saving an email
 */
export const useSaveEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveEmail,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'saveEmail: Service error')
      }
    },
  })
}
