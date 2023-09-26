import { useMutation } from '@tanstack/react-query'

import { Params as APIParams, post } from 'store/api'
import { AddressData, AddressValidationData, ValidateAddressData } from 'api/types'
import { contactInformationKeys } from './queryKeys'
import { getAddressDataFromSuggestedAddress, getConfirmedSuggestions, getSuggestedAddresses, getValidationKey, showValidationScreen } from 'utils/personalInformation'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { saveAddress } from './saveAddress'
import queryClient from 'api/queryClient'

type ValidateAddressParameters = {
  addressData: AddressData
  abortSignal?: AbortSignal
}

/**
 * Determines whether an address needs to be validated. If so, returns validation data; otherwise, saves the address
 */
export const validateAddress = async ({ addressData, abortSignal }: ValidateAddressParameters): Promise<ValidateAddressData | undefined> => {
  const response = await post<AddressValidationData>('/v0/user/addresses/validate', addressData as unknown as APIParams, undefined, abortSignal)

  const suggestedAddresses = getSuggestedAddresses(response)
  const confirmedSuggestedAddresses = getConfirmedSuggestions(suggestedAddresses)
  const validationKey = getValidationKey(suggestedAddresses)
  const addressNeedsValidation = confirmedSuggestedAddresses && showValidationScreen(addressData, suggestedAddresses)

  if (addressNeedsValidation) {
    return { confirmedSuggestedAddresses, validationKey }
  }

  // If no validation is needed, we can use the first and only suggested address to update with
  if (suggestedAddresses) {
    const suggestedAddress = getAddressDataFromSuggestedAddress(suggestedAddresses[0], addressData.id)
    await saveAddress({ addressData: suggestedAddress })
  }
}

/**
 * Returns a mutation for validating an address
 */
export const useValidateAddress = () => {
  return useMutation({
    mutationFn: validateAddress,
    onSuccess: (data) => {
      if (!data?.confirmedSuggestedAddresses) {
        queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
      }
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'validateAddress: Service error')
      }
    },
  })
}
