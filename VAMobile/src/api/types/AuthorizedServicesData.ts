export type FacilityInfo = {
  facilityId: number
  facilityName: string
}

export type MigrationPhases = {
  current: string
  p0: string
  p1: string
  p2: string
  p3: string
  p4: string
  p5: string
  p6: string
  p7: string
}

export type MigratingFacility = {
  migrationDate: string
  facilities: FacilityInfo[]
  phases: MigrationPhases
}

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
        benefitsPushNotification: boolean
      }
    }
  }
  meta: {
    isUserAtPretransitionedOhFacility: boolean
    isUserFacilityReadyForInfoAlert: boolean
    migratingFacilitiesList: MigratingFacility[]
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
  benefitsPushNotification: boolean
  migratingFacilitiesList: MigratingFacility[]
}
