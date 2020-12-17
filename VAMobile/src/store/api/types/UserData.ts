import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type UserDataProfile = {
  firstName: string
  middleName: string
  lastName: string
  fullName: string
  contactEmail: EmailData
  signinEmail: string
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
}

export type EmailData = {
  id: string
  emailAddress: string
}

export type VAServices = 'appeals' | 'appointments' | 'claims' | 'directDepositBenefits' | 'lettersAndDocuments' | 'militaryServiceHistory' | 'userProfileUpdate'

export const VAServicesConstants: {
  Appeals: VAServices
  Appointments: VAServices
  Claims: VAServices
  DirectDepositBenefits: VAServices
  LettersAndDocuments: VAServices
  MilitaryServiceHistory: VAServices
  UserProfileUpdate: VAServices
} = {
  Appeals: 'appeals',
  Appointments: 'appointments',
  Claims: 'claims',
  DirectDepositBenefits: 'directDepositBenefits',
  LettersAndDocuments: 'lettersAndDocuments',
  MilitaryServiceHistory: 'militaryServiceHistory',
  UserProfileUpdate: 'userProfileUpdate',
}

export type UserData = {
  data: {
    attributes: {
      id: string
      type: string
      authorizedServices: Array<VAServices>
      profile: UserDataProfile
    }
  }
}
