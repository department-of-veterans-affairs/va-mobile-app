export const PhoneTypeConstants: {
  HOME: PhoneType
  MOBILE: PhoneType
  WORK: PhoneType
  FAX: PhoneType
} = {
  HOME: 'HOME',
  MOBILE: 'MOBILE',
  WORK: 'WORK',
  FAX: 'FAX',
}

export type PhoneType = 'HOME' | 'MOBILE' | 'WORK' | 'FAX'

export type ProfileFormattedFieldType = 'formattedHomePhone' | 'formattedWorkPhone' | 'formattedMobilePhone' | 'formattedFaxPhone'

export type PhoneData = {
  id?: number
  areaCode: string
  countryCode: string
  phoneNumber: string
  extension?: string
  phoneType: PhoneType
}
