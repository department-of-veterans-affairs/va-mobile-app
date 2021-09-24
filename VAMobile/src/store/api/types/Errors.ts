// parent level error object that contains the status, text, and json properties from a fetch response stream
// used to keep full error information in respective stores
// json property is used to parse through to find error metadata
export type APIError = {
  status?: number
  text?: string
  networkError?: boolean
  json?: {
    errors: Array<{
      title: string
      detail: string
      code: string
      source: string
      meta?: {
        messages?: Array<ErrorMessage>
      }
    }>
  }
}

export type ErrorMessage = {
  key: string
  severity: string
  text: string
}

export type DowntimeFeatureType =
  | 'facility_locator'
  | 'auth_dslogon'
  | 'auth_idme'
  | 'auth_mhv'
  | 'appeals'
  | 'military_service_history'
  | 'claims'
  | 'direct_deposit_benefits'
  | 'letters_and_documents'
  | 'secure_messaging'
  | 'appointments'
  | 'user_profile_update'

export const DowntimeFeatureTypeConstants: {
  facilityLocator: DowntimeFeatureType
  authDSLogon: DowntimeFeatureType
  authIDMe: DowntimeFeatureType
  authMHV: DowntimeFeatureType
  appeals: DowntimeFeatureType
  militaryServiceHistory: DowntimeFeatureType
  claims: DowntimeFeatureType
  directDepositBenefits: DowntimeFeatureType
  letters: DowntimeFeatureType
  secureMessaging: DowntimeFeatureType
  appointments: DowntimeFeatureType
  userProfileUpdate: DowntimeFeatureType
} = {
  facilityLocator: 'facility_locator',
  authDSLogon: 'auth_dslogon',
  authIDMe: 'auth_idme',
  authMHV: 'auth_mhv',
  appeals: 'appeals',
  militaryServiceHistory: 'military_service_history',
  claims: 'claims',
  directDepositBenefits: 'direct_deposit_benefits',
  letters: 'letters_and_documents',
  secureMessaging: 'secure_messaging',
  appointments: 'appointments',
  userProfileUpdate: 'user_profile_update',
}

export const DowntimeFeatureNameTypes = {
  [DowntimeFeatureTypeConstants.facilityLocator]: 'Facility Locator',
  [DowntimeFeatureTypeConstants.claims]: 'Claims',
  [DowntimeFeatureTypeConstants.appointments]: 'Appointments',
  [DowntimeFeatureTypeConstants.secureMessaging]: 'Secure Messaging',
  [DowntimeFeatureTypeConstants.letters]: 'Letters',
  [DowntimeFeatureTypeConstants.directDepositBenefits]: 'Direct Deposit',
}

// 'Claims' | 'Appointments' | 'Secure Messaging' | 'Letters' | 'Disability Rating' | 'Direct Deposit'
