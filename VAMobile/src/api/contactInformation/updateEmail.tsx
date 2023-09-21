import { Params as APIParams, EditResponseData, post, put } from 'store/api'
import { EmailData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Creates or updates a user's email depending on whether an `id` field is present
 */
const updateEmail = async (emailData: EmailData) => {
  const endpoint = '/v0/user/emails'

  if (!emailData.id) {
    return post<EditResponseData>(endpoint, emailData as unknown as APIParams)
  }

  return put<EditResponseData>(endpoint, emailData as unknown as APIParams)
}

/**
 * Returns a mutation for updating an email
 */
export const useUpdateEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateEmail,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updateEmail: Service error')
      }
    },
  })
}
