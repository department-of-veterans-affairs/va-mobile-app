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
  id: number
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
