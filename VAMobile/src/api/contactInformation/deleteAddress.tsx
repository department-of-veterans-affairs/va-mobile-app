import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AddressData } from 'api/types'
import { Params as APIParams, EditResponseData, del } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { contactInformationKeys } from './queryKeys'

/**
 * Deletes a user's address
 */
const deleteAddress = (addressData: AddressData) => {
  return del<EditResponseData>('/v0/user/addresses', addressData as unknown as APIParams)
}

/**
 * Returns a mutation for deleting an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deleteAddress: Service error')
      }
    },
  })
}
