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
  formatted_home_phone?: string
  mobile_phone: PhoneData
  formatted_mobile_phone?: string
  work_phone: PhoneData
  formatted_work_phone?: string
  fax_phone: PhoneData
  formatted_fax_phone?: string
  most_recent_branch: string
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
