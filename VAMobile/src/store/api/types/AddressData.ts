export const addressTypeFields: {
  domestic: addressTypes
  international: addressTypes
  overseasMilitary: addressTypes
} = {
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  overseasMilitary: 'OVERSEAS MILITARY',
}

export type addressTypes = 'DOMESTIC' | 'INTERNATIONAL' | 'OVERSEAS MILITARY'

export type addressPouTypes = 'RESIDENCE/CHOICE' | 'CORRESPONDENCE'

export type AddressData = {
  addressMetaData?: addressValidationMetadata
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
  validationKey?: string
}

export type AddressValidationData = {
  data: Array<{
    id: string
    type: string
    attributes: {
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
    meta: addressValidationMetadata
  }>
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

export type DeliveryPointValidationTypes =
  | 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER'
  | 'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER'
  | 'MISSING_ZIP'
  | 'CONFIRMED'
  | 'UNDELIVERABLE'

export const DeliveryPointValidationTypesConstants: {
  BAD_UNIT_NUMBER: DeliveryPointValidationTypes
  ADD_UNIT_NUMBER: DeliveryPointValidationTypes
  MISSING_ZIP: DeliveryPointValidationTypes
  CONFIRMED: DeliveryPointValidationTypes
  UNDELIVERABLE: DeliveryPointValidationTypes
} = {
  BAD_UNIT_NUMBER: 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER',
  ADD_UNIT_NUMBER: 'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
  MISSING_ZIP: 'MISSING_ZIP',
  CONFIRMED: 'CONFIRMED',
  UNDELIVERABLE: 'UNDELIVERABLE',
}

export const AddressValidationScenarioTypesConstants: {
  SUCCESS: AddressValidationScenarioTypes
  NO_SUGGESTIONS: AddressValidationScenarioTypes
  SUGGESTIONS: AddressValidationScenarioTypes
  BAD_UNIT_NUMBER: AddressValidationScenarioTypes
  ADD_UNIT_NUMBER: AddressValidationScenarioTypes
} = {
  SUCCESS: 'SUCCESS', // user input only has one match with significantly high confidence
  NO_SUGGESTIONS: 'NO_SUGGESTIONS', // user input has no suggested address matches
  SUGGESTIONS: 'SUGGESTIONS', // user input has one or more suggested address matches
  BAD_UNIT_NUMBER: 'BAD_UNIT_NUMBER', // user's street number is validated but the unit number may be invalid
  ADD_UNIT_NUMBER: 'ADD_UNIT_NUMBER', // user's street number is validated but a unit number may need to be specified
}

export type AddressValidationScenarioTypes = 'SUCCESS' | 'NO_SUGGESTIONS' | 'SUGGESTIONS' | 'BAD_UNIT_NUMBER' | 'ADD_UNIT_NUMBER'
