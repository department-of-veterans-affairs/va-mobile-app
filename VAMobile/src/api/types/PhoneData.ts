export type PhoneType = 'HOME' | 'MOBILE' | 'WORK'

export type PhoneKey = 'homePhone' | 'mobilePhone' | 'workPhone'

export type FormattedPhoneType = 'formattedHomePhone' | 'formattedWorkPhone' | 'formattedMobilePhone'

export type PhoneData = {
  id?: number
  areaCode: string
  countryCode: string
  phoneNumber: string
  extension?: string
  phoneType: PhoneType
}

export const PhoneTypeToFormattedNumber: {
  [key in PhoneType]: FormattedPhoneType
} = {
  HOME: 'formattedHomePhone',
  MOBILE: 'formattedMobilePhone',
  WORK: 'formattedWorkPhone',
}

export const PhoneTypeConstants: {
  HOME: PhoneType
  MOBILE: PhoneType
  WORK: PhoneType
} = {
  HOME: 'HOME',
  MOBILE: 'MOBILE',
  WORK: 'WORK',
}
