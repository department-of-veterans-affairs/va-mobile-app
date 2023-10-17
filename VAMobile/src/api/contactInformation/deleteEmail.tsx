import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Params as APIParams, EditResponseData, del } from 'store/api'
import { EmailData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'

/**
 * Deletes a user's email
 */
const deleteEmail = (emailData: EmailData) => {
  return del<EditResponseData>('/v0/user/emails', emailData as unknown as APIParams)
}

/**
 * Returns a mutation for deleting an email
 */
export const useDeleteEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmail,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deleteEmail: Service error')
      }
    },
  })
}
