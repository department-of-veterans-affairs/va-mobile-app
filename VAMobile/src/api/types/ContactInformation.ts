import { AddressData } from 'api/types/AddressData'
import { EmailData } from 'api/types/EmailData'
import { PhoneData } from 'api/types/PhoneData'

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
