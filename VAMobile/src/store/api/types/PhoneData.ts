export const PhoneTypeConstants: {
  HOME: PhoneType
  MOBILE: PhoneType
  WORK: PhoneType
} = {
  HOME: 'HOME',
  MOBILE: 'MOBILE',
  WORK: 'WORK',
}

export type PhoneType = 'HOME' | 'MOBILE' | 'WORK'

export type ProfileFormattedFieldType = 'formattedHomePhone' | 'formattedWorkPhone' | 'formattedMobilePhone'

export type PhoneData = {
  id?: number
  areaCode: string
  countryCode: string
  phoneNumber: string
  extension?: string
  phoneType: PhoneType
}
