import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type EmailData = {
  id?: string
  emailAddress: string
}

export type ContactInformationPayload = {
  data: {
    attributes: {
      residentialAddress: AddressData | null
      mailingAddress: AddressData | null
      homePhone: PhoneData | null
      mobilePhone: PhoneData | null
      workPhone: PhoneData | null
      contactEmail?: EmailData | null
    }
  }
}

export type UserContactInformation = ContactInformationPayload['data']['attributes'] & {
  formattedHomePhone: string | null
  formattedMobilePhone: string | null
  formattedWorkPhone: string | null
}
