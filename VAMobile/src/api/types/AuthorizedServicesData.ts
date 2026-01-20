export type AuthorizedServicesPayload = {
  data: {
    id: string
    type: string
    attributes: {
      authorizedServices: {
        allergiesOracleHealthEnabled: boolean
        appeals: boolean
        appointments: boolean
        claims: boolean
        decisionLetters: boolean
        directDepositBenefits: boolean
        directDepositBenefitsUpdate: boolean
        disabilityRating: boolean
        labsAndTestsEnabled: boolean
        lettersAndDocuments: boolean
        medicationsOracleHealthEnabled: boolean
        militaryServiceHistory: boolean
        paymentHistory: boolean
        preferredName: boolean
        prescriptions: boolean
        scheduleAppointments: boolean
        secureMessaging: boolean
        secureMessagingOracleHealthEnabled: boolean
        userProfileUpdate: boolean
      }
    }
  }
  meta: {
    isUserAtPretransitionedOhFacility: boolean
    isUserFacilityReadyForInfoAlert: boolean
  }
}

export type UserAuthorizedServicesData = {
  allergiesOracleHealthEnabled: boolean
  appeals: boolean
  appointments: boolean
  claims: boolean
  decisionLetters: boolean
  directDepositBenefits: boolean
  directDepositBenefitsUpdate: boolean
  disabilityRating: boolean
  labsAndTestsEnabled: boolean
  lettersAndDocuments: boolean
  medicationsOracleHealthEnabled: boolean
  militaryServiceHistory: boolean
  paymentHistory: boolean
  preferredName: boolean
  prescriptions: boolean
  scheduleAppointments: boolean
  secureMessaging: boolean
  secureMessagingOracleHealthEnabled: boolean
  userProfileUpdate: boolean
  isUserAtPretransitionedOhFacility: boolean
  isUserFacilityReadyForInfoAlert: boolean
}
