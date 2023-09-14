import { Params as APIParams, EditResponseData, put } from 'store/api'
import { PhoneData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Update's a user's phone number
 */
export const updatePhoneNumber = async (phoneData: PhoneData) => {
  try {
    return put<EditResponseData>('/v0/user/phones', phoneData as unknown as APIParams)
  } catch (error) {
    throw error
  }
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
