import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type SigninServiceTypes = 'IDME' | 'DSL' | 'MHV'

export const SigninServiceTypesConstants: {
  IDME: SigninServiceTypes
  DSL: SigninServiceTypes
  MHV: SigninServiceTypes
} = {
  IDME: 'IDME',
  DSL: 'DSL',
  MHV: 'MHV',
}

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
  faxNumber: PhoneData
  formattedFaxPhone?: string
  signinService: SigninServiceTypes
}

export type EmailData = {
  id: string
  emailAddress: string
}

export type VAServices =
  | 'appeals'
  | 'appointments'
  | 'claims'
  | 'directDepositBenefits'
  | 'lettersAndDocuments'
  | 'militaryServiceHistory'
  | 'userProfileUpdate'
  | 'secureMessaging'

export const VAServicesConstants: {
  Appeals: VAServices
  Appointments: VAServices
  Claims: VAServices
  DirectDepositBenefits: VAServices
  LettersAndDocuments: VAServices
  MilitaryServiceHistory: VAServices
  UserProfileUpdate: VAServices
  SecureMessaging: VAServices
} = {
  Appeals: 'appeals',
  Appointments: 'appointments',
  Claims: 'claims',
  DirectDepositBenefits: 'directDepositBenefits',
  LettersAndDocuments: 'lettersAndDocuments',
  MilitaryServiceHistory: 'militaryServiceHistory',
  UserProfileUpdate: 'userProfileUpdate',
  SecureMessaging: 'secureMessaging',
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

export type EditMetaDataPayload = {
  code: string // todo find the list of codes to expect
  key: string
  retryable: string
  severity: string
  text: string
}

export type EditResponseData = {
  data: {
    attributes: {
      id: string
      type: string
      attributes: {
        transactionId: string
        transactionStatus: string
        type: string
        metadata: Array<EditMetaDataPayload>
      }
    }
  }
}

export const UserGreetingTimeConstants: {
  MORNING: number
  AFTERNOON: number
  EVENING: number
} = {
  MORNING: 12,
  AFTERNOON: 18,
  EVENING: 4,
}
