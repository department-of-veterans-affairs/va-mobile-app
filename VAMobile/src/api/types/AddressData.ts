export type addressTypes = 'DOMESTIC' | 'INTERNATIONAL' | 'OVERSEAS MILITARY'

export const addressTypeFields: {
  domestic: addressTypes
  international: addressTypes
  overseasMilitary: addressTypes
} = {
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  overseasMilitary: 'OVERSEAS MILITARY',
}

export type ProfileAddressType = 'mailingAddress' | 'residentialAddress'

export type addressPouTypes = 'RESIDENCE/CHOICE' | 'CORRESPONDENCE'

export type AddressData = {
  addressMetaData?: addressValidationMetadataForPayload
  id?: number
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressPou: addressPouTypes
  addressType: addressTypes
  city: string
  countryName?: string
  countryCodeIso3: string
  internationalPostalCode?: string
  province?: string
  stateCode?: string
  zipCode: string
  zipCodeSuffix?: string
  validationKey?: number
}

export type AddressValidationData = {
  data: Array<SuggestedAddress>
}

export type ValidateAddressData = {
  confirmedSuggestedAddresses?: Array<SuggestedAddress>
  validationKey?: number
}

export type SaveAddressParameters = {
  addressData: AddressData
  revalidate?: boolean
}

export type SuggestedAddressAttributeType = {
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressPou: addressPouTypes
  addressType: addressTypes
  city: string
  countryCodeIso3: string
  internationalPostalCode: string
  province: string
  stateCode: string
  zipCode: string
  zipCodeSuffix: string
}

export type SuggestedAddress = {
  id: string
  type: string
  attributes: SuggestedAddressAttributeType
  meta: addressValidationMetadata
}

type addressValidationMetadata = {
  address: {
    confidenceScore: number
    addressType: addressTypes
    deliveryPointValidation: string
    residentialDeliveryIndicator: string
  }
  validationKey: number
}

type addressValidationMetadataForPayload = {
  confidenceScore: number
  addressType: addressTypes
  deliveryPointValidation: string
  residentialDeliveryIndicator: string
}

export type DeliveryPointValidationTypes =
  | 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER'
  | 'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER'
  | 'MISSING_ZIP'
  | 'CONFIRMED'
  | 'UNDELIVERABLE'

export const DeliveryPointValidationTypesConstants: {
  BAD_UNIT_NUMBER: DeliveryPointValidationTypes
  MISSING_UNIT_NUMBER: DeliveryPointValidationTypes
  MISSING_ZIP: DeliveryPointValidationTypes
  CONFIRMED: DeliveryPointValidationTypes
  UNDELIVERABLE: DeliveryPointValidationTypes
} = {
  BAD_UNIT_NUMBER: 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER',
  MISSING_UNIT_NUMBER: 'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
  MISSING_ZIP: 'MISSING_ZIP',
  CONFIRMED: 'CONFIRMED',
  UNDELIVERABLE: 'UNDELIVERABLE',
}

export const AddressValidationScenarioTypesConstants: {
  BAD_UNIT_NUMBER: AddressValidationScenarioTypes
  BAD_UNIT_NUMBER_OVERRIDE: AddressValidationScenarioTypes
  MISSING_UNIT_NUMBER: AddressValidationScenarioTypes
  MISSING_UNIT_OVERRIDE: AddressValidationScenarioTypes
  SHOW_SUGGESTIONS: AddressValidationScenarioTypes
  SHOW_SUGGESTIONS_OVERRIDE: AddressValidationScenarioTypes
  SHOW_SUGGESTIONS_NO_CONFIRMED: AddressValidationScenarioTypes
  SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE: AddressValidationScenarioTypes
} = {
  BAD_UNIT_NUMBER: 'BAD_UNIT_NUMBER',
  BAD_UNIT_NUMBER_OVERRIDE: 'BAD_UNIT_NUMBER_OVERRIDE',
  MISSING_UNIT_NUMBER: 'MISSING_UNIT_NUMBER',
  MISSING_UNIT_OVERRIDE: 'MISSING_UNIT_OVERRIDE',
  SHOW_SUGGESTIONS: 'SHOW_SUGGESTIONS',
  SHOW_SUGGESTIONS_OVERRIDE: 'SHOW_SUGGESTIONS_OVERRIDE',
  SHOW_SUGGESTIONS_NO_CONFIRMED: 'SHOW_SUGGESTIONS_NO_CONFIRMED',
  SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE: 'SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE',
}

export const AddressPouToProfileAddressFieldType: {
  [key in addressPouTypes]: ProfileAddressType
} = {
  ['RESIDENCE/CHOICE']: 'residentialAddress',
  CORRESPONDENCE: 'mailingAddress',
}

export type AddressValidationScenarioTypes =
  | 'BAD_UNIT_NUMBER'
  | 'BAD_UNIT_NUMBER_OVERRIDE'
  | 'MISSING_UNIT_NUMBER'
  | 'MISSING_UNIT_OVERRIDE'
  | 'SHOW_SUGGESTIONS'
  | 'SHOW_SUGGESTIONS_OVERRIDE'
  | 'SHOW_SUGGESTIONS_NO_CONFIRMED'
  | 'SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE'
