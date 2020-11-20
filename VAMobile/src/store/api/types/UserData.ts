import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type UserDataProfile = {
  firstName: string
  middleName: string
  lastName: string
  fullName: string
  email: string
  birthDate: string
  gender: string
  addresses: string
  residentialAddress?: AddressData
  mailingAddress?: AddressData
  homePhoneNumber: PhoneData
  formattedHomePhone?: string
  mobilePhoneNumber: PhoneData
  formattedMobilePhone?: string
  workPhoneNumber: PhoneData
  formattedWorkPhone?: string
  faxPhoneNumber: PhoneData
  formattedFaxPhone?: string
  mostRecentBranch: string
}

export type UserData = {
  data: {
    attributes: {
      id: string
      type: string
      authorizedServices: Array<string>
      profile: UserDataProfile
    }
  }
}
