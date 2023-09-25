import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Params as APIParams, EditResponseData, put } from 'store/api'
import { PhoneData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'

/**
 * Updates a user's phone number
 */
const updatePhoneNumber = (phoneData: PhoneData) => {
  return put<EditResponseData>('/v0/user/phones', phoneData as unknown as APIParams)
}

/**
 * Returns a mutation for updating a phone number
 */
export const useUpdatePhoneNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePhoneNumber,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updatePhoneNumber: Service error')
      }
    },
  })
}
