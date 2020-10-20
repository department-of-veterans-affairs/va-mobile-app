export type AddressData = {
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressPou: 'RESIDENCE/CHOICE' | 'CORRESPONDENCE'
  addressType: 'DOMESTIC' | 'INTERNATIONAL'
  city: string
  countryCode: string
  internationalPostalCode?: string
  province?: string
  stateCode: string
  zipCode: string
  zipCodeSuffix?: string
}
