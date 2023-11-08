import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Params as APIParams, EditResponseData, del } from 'store/api'
import { AddressData } from 'api/types'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

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
