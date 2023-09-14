import { Params as APIParams, EditResponseData, del } from 'store/api'
import { PhoneData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Deletes a user's phone number
 */
export const deletePhoneNumber = async (phoneData: PhoneData) => {
  try {
    return del<EditResponseData>('/v0/user/phones', phoneData as unknown as APIParams)
  } catch (error) {
    throw error
  }
}

/**
 * Returns a mutation for deleting a phone number
 */
export const useDeletePhoneNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePhoneNumber,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deletePhoneNumber: Service error')
      }
    },
  })
}
