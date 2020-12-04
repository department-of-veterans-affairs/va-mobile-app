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

export type AddressData = {
  id: number
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressPou: 'RESIDENCE/CHOICE' | 'CORRESPONDENCE'
  addressType: addressTypes
  city: string
  countryCode: string
  internationalPostalCode?: string
  province?: string
  stateCode: string
  zipCode: string
  zipCodeSuffix?: string
}

export type AddressPostData = {
  validationKey?: string
  id: number
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressPou: 'RESIDENCE/CHOICE' | 'CORRESPONDENCE'
  addressType: addressTypes
  city: string
  countryName: string
  countryCodeIso3: string
  internationalPostalCode?: string
  province?: string
  stateCode: string
  zipCode: string
  zipCodeSuffix?: string
}
