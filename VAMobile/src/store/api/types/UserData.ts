import { AddressData } from './AddressData'
import { PhoneData } from './PhoneData'

export type SigninServiceTypes = 'IDME' | 'DSL' | 'MHV' | 'LOGINGOV'

export const SigninServiceTypesConstants: {
  IDME: SigninServiceTypes
  DSL: SigninServiceTypes
  MHV: SigninServiceTypes
  LOGINGOV: SigninServiceTypes
} = {
  IDME: 'IDME',
  DSL: 'DSL',
  MHV: 'MHV',
  LOGINGOV: 'LOGINGOV',
}

export type UserDataProfile = {
  firstName: string
  preferredName: string
  middleName: string
  lastName: string
  fullName: string
  contactEmail: EmailData
  signinEmail: string
  birthDate: string
  genderIdentity: string
  addresses: string
  residentialAddress?: AddressData
  mailingAddress?: AddressData
  homePhoneNumber: PhoneData
  formattedHomePhone?: string
  mobilePhoneNumber: PhoneData
  formattedMobilePhone?: string
  workPhoneNumber: PhoneData
  formattedWorkPhone?: string
  signinService: SigninServiceTypes
}

export type Facility = {
  facilityId: string
  isCerner: boolean
  facilityName: string
}

export type CernerData = {
  isCernerPatient: boolean
  facilities: Array<Facility>
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
  | 'directDepositBenefitsUpdate'
  | 'lettersAndDocuments'
  | 'militaryServiceHistory'
  | 'userProfileUpdate'
  | 'secureMessaging'
  | 'scheduleAppointments'
  | 'prescriptions'

export const VAServicesConstants: {
  Appeals: VAServices
  Appointments: VAServices
  Claims: VAServices
  DirectDepositBenefits: VAServices
  DirectDepositBenefitsUpdate: VAServices
  LettersAndDocuments: VAServices
  MilitaryServiceHistory: VAServices
  UserProfileUpdate: VAServices
  SecureMessaging: VAServices
  ScheduleAppointments: VAServices
  Prescriptions: VAServices
} = {
  Appeals: 'appeals',
  Appointments: 'appointments',
  Claims: 'claims',
  DirectDepositBenefits: 'directDepositBenefits',
  DirectDepositBenefitsUpdate: 'directDepositBenefitsUpdate',
  LettersAndDocuments: 'lettersAndDocuments',
  MilitaryServiceHistory: 'militaryServiceHistory',
  UserProfileUpdate: 'userProfileUpdate',
  SecureMessaging: 'secureMessaging',
  ScheduleAppointments: 'scheduleAppointments',
  Prescriptions: 'prescriptions',
}

export type UserData = {
  data: {
    attributes: {
      id: string
      type: string
      authorizedServices: Array<VAServices>
      profile: UserDataProfile
      health: CernerData
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

export type GenderIdentityOptions = {
  [key: string]: string
}

export type GenderIdentityOptionsData = {
  data: {
    id: string
    type: string
    attributes: {
      options: GenderIdentityOptions
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
