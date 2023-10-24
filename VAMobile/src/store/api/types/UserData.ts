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

export type VAServices =
  | 'appeals'
  | 'appointments'
  | 'claims'
  | 'decisionLetters'
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
  DecisionLetters: VAServices
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
  DecisionLetters: 'decisionLetters',
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
