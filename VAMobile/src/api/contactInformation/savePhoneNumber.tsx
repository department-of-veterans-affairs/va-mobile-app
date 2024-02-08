import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PhoneData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { Params as APIParams, EditResponseData, post, put } from 'store/api'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { contactInformationKeys } from './queryKeys'

/**
 * Creates or updates a user's phone number depending on whether the `id` field is present
 */
const savePhoneNumber = (phoneData: PhoneData) => {
  const endpoint = '/v0/user/phones'

  if (phoneData.id) {
    return put<EditResponseData>(endpoint, phoneData as unknown as APIParams)
  }

  return post<EditResponseData>(endpoint, phoneData as unknown as APIParams)
}

/**
 * Returns a mutation for saving a phone number
 */
export const useSavePhoneNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: savePhoneNumber,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'savePhoneNumber: Service error')
      }
    },
  })
}
