import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type UserDataProfile = {
  first_name: string
  middle_name: string
  last_name: string
  full_name: string
  email: string
  birth_date: string
  gender: string
  addresses: string
  residential_address?: AddressData
  mailing_address?: AddressData
  home_phone: PhoneData
  mobile_phone: PhoneData
  work_phone: PhoneData
  most_recent_branch: string // TODO: verify this fields type
  fax_number: string // TODO: verify this fields type
}

export type UserData = {
  data: {
    attributes: {
      id: string
      type: string
      authorized_services: Array<string>
      profile: UserDataProfile
    }
  }
}
