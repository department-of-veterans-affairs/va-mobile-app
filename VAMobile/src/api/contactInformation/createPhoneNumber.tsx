import { Params as APIParams, EditResponseData, post } from 'store/api'
import { PhoneData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Creates a phone number for a user
 */
export const createPhoneNumber = async (phoneData: PhoneData) => {
  try {
    return post<EditResponseData>('/v0/user/phones', phoneData as unknown as APIParams)
  } catch (error) {
    throw error
  }
}

/**
 * Returns a mutation for creating a phone number
 */
export const useCreatePhoneNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPhoneNumber,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'createPhoneNumber: Service error')
      }
    },
  })
}
