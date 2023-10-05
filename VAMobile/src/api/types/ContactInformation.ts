import { AddressData } from './AddressData'
import { EmailData } from './EmailData'
import { PhoneData } from './PhoneData'

export type ContactInformationPayload = {
  data: {
    attributes: {
      residentialAddress: AddressData | null
      mailingAddress: AddressData | null
      homePhone: PhoneData | null
      mobilePhone: PhoneData | null
      workPhone: PhoneData | null
      contactEmail: EmailData | null
    }
  }
}

export type UserContactInformation = ContactInformationPayload['data']['attributes'] & {
  formattedHomePhone: string | null
  formattedMobilePhone: string | null
  formattedWorkPhone: string | null
}
