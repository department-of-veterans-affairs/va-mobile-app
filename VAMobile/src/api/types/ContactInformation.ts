import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type EmailData = {
  id: string
  emailAddress: string
}

export type ContactInformationPayload = {
  data: {
    attributes: {
      residentialAddress?: AddressData
      mailingAddress?: AddressData
      homePhoneNumber: PhoneData
      mobilePhoneNumber?: PhoneData
      workPhoneNumber?: PhoneData
      contactEmail: EmailData
    }
  }
}

export type UserContactInformation = {
  residentialAddress?: AddressData
  mailingAddress?: AddressData
  homePhoneNumber: PhoneData
  formattedHomePhone?: string
  mobilePhoneNumber?: PhoneData
  formattedMobilePhone?: string
  workPhoneNumber?: PhoneData
  formattedWorkPhone?: string
  contactEmail: EmailData
}
