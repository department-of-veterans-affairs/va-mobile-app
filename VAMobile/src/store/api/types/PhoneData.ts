export type PhoneType = 'HOME' | 'MOBILE' | 'WORK' | 'FAX'

export type PhoneData = {
  id: number
  areaCode: string
  countryCode: string
  phoneNumber: string
  phoneType: PhoneType
}
