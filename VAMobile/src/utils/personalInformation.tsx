import { AddressValidationData, AddressValidationScenarioTypes, AddressValidationScenarioTypesConstants, DeliveryPointValidationTypesConstants } from 'store/api/types'

export const getAddressValidationScenarioFromAddressValidationData = (addressValidationData?: AddressValidationData): AddressValidationScenarioTypes | undefined => {
  if (!addressValidationData) {
    return
  }

  const suggestions = addressValidationData?.data

  if (!suggestions || suggestions.length === 0) {
    return AddressValidationScenarioTypesConstants.NO_SUGGESTIONS
  }

  if (suggestions.length === 1) {
    const metadata = suggestions[0]?.meta?.address

    if (!metadata) {
      return
    }

    // this garbage/invalid suggestion indicates that there are no valid suggestions to present to user
    if (metadata.confidenceScore < 1 && metadata.deliveryPointValidation === DeliveryPointValidationTypesConstants.MISSING_ZIP) {
      return AddressValidationScenarioTypesConstants.NO_SUGGESTIONS
    }

    if (metadata.confidenceScore > 90 && metadata.deliveryPointValidation === DeliveryPointValidationTypesConstants.ADD_UNIT_NUMBER) {
      return AddressValidationScenarioTypesConstants.ADD_UNIT_NUMBER
    }

    if (metadata.confidenceScore > 90 && metadata.deliveryPointValidation === DeliveryPointValidationTypesConstants.BAD_UNIT_NUMBER) {
      return AddressValidationScenarioTypesConstants.BAD_UNIT_NUMBER
    }

    // success case where user needs no further confirmation to proceed with saving address
    if (metadata.confidenceScore > 90) {
      return AddressValidationScenarioTypesConstants.SUCCESS
    }
  }

  return AddressValidationScenarioTypesConstants.SUGGESTIONS
}
