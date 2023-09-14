import { Params as APIParams, EditResponseData, del } from 'store/api'
import { AddressData } from 'api/types'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Deletes a user's address
 */
export const deleteAddress = async (addressData: AddressData) => {
  try {
    return del<EditResponseData>('/v0/user/addresses', addressData as unknown as APIParams)
  } catch (error) {
    throw error
  }
}

/**
 * Returns a mutation for deleting an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deleteAddress: Service error')
      }
    },
  })
}
