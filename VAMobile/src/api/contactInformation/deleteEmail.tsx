import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EmailData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { Params as APIParams, EditResponseData, del } from 'store/api'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { contactInformationKeys } from './queryKeys'

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
