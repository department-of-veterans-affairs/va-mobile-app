import { Params as APIParams, post } from 'store/api'
import { AddressData, AddressValidationData, ValidateAddressData } from 'api/types'
import { getConfirmedSuggestions, getSuggestedAddresses, getValidationKey } from 'utils/personalInformation'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { useMutation } from '@tanstack/react-query'

/**
 * Validates an address and returns the validation key of the suggested address with the highest confidence score
 */
const validateAddress = async (addressData: AddressData): Promise<ValidateAddressData> => {
  try {
    const response = await post<AddressValidationData>('/v0/user/addresses/validate', addressData as unknown as APIParams)
    const suggestedAddresses = getSuggestedAddresses(response)
    const confirmedSuggestedAddresses = getConfirmedSuggestions(suggestedAddresses)
    const validationKey = getValidationKey(suggestedAddresses)
    return { confirmedSuggestedAddresses, suggestedAddresses, validationKey }
  } catch (error) {
    throw error
  }
}

/**
 * Returns a mutation for validating an address
 */
export const useValidateAddress = () => {
  return useMutation({
    mutationFn: validateAddress,
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'validateAddress: Service error')
      }
    },
  })
}
