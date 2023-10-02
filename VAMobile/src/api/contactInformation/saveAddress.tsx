import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Params as APIParams, EditResponseData, post, put } from 'store/api'
import { SaveAddressParameters } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { contactInformationKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { validateAddress } from './validateAddress'

/**
 * Creates or updates a user's address depending on whether the `id` field is present
 */
export const saveAddress = async ({ addressData, revalidate }: SaveAddressParameters) => {
  const addressEndpoint = '/v0/user/addresses'

  if (revalidate) {
    const validationData = await validateAddress({ addressData })
    addressData.validationKey = validationData?.validationKey
  }

  if (addressData.id) {
    return put<EditResponseData>(addressEndpoint, addressData as unknown as APIParams)
  }

  return post<EditResponseData>(addressEndpoint, addressData as unknown as APIParams)
}

/**
 * Returns a mutation for saving an address
 */
export const useSaveAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveAddress,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'saveAddress: Service error')
      }
    },
  })
}
