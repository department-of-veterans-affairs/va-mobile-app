// parent level error object that contains the status, text, and json properties from a fetch response stream
// used to keep full error information in respective stores
// json property is used to parse through to find error metadata
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

export type APIError = {
  status?: number
  text?: string
  networkError?: boolean
  endpoint?: string
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

// exact service names received from maintenance windows api
export type DowntimeFeatureType =
  | 'facility_locator'
  | 'auth_dslogon'
  | 'auth_idme'
  | 'auth_mhv'
  | 'appeals'
  | 'military_service_history'
  | 'claims'
  | 'direct_deposit_benefits'
  | 'disability_rating'
  | 'letters_and_documents'
  | 'secure_messaging'
  | 'appointments'
  | 'user_profile_update'
  | 'payment_history'
  | 'rx_refill'

export const DowntimeFeatureTypeConstants: {
  facilityLocator: DowntimeFeatureType
  authDSLogon: DowntimeFeatureType
  authIDMe: DowntimeFeatureType
  authMHV: DowntimeFeatureType
  appeals: DowntimeFeatureType
  militaryServiceHistory: DowntimeFeatureType
  claims: DowntimeFeatureType
  directDepositBenefits: DowntimeFeatureType
  disabilityRating: DowntimeFeatureType
  letters: DowntimeFeatureType
  secureMessaging: DowntimeFeatureType
  appointments: DowntimeFeatureType
  userProfileUpdate: DowntimeFeatureType
  payments: DowntimeFeatureType
  rx: DowntimeFeatureType
} = {
  facilityLocator: 'facility_locator',
  authDSLogon: 'auth_dslogon',
  authIDMe: 'auth_idme',
  authMHV: 'auth_mhv',
  appeals: 'appeals',
  militaryServiceHistory: 'military_service_history',
  claims: 'claims',
  directDepositBenefits: 'direct_deposit_benefits',
  disabilityRating: 'disability_rating',
  letters: 'letters_and_documents',
  secureMessaging: 'secure_messaging',
  appointments: 'appointments',
  userProfileUpdate: 'user_profile_update',
  payments: 'payment_history',
  rx: 'rx_refill',
}

export const ScreenIDToFeatureName = {
  [ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID]: 'Claims',
  [ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID]: 'Claims',
  [ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID]: 'Appointments',
  [ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID]: 'Secure Messaging',
  [ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID]: 'Secure Messaging',
  [ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID]: 'Letters',
  [ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID]: 'Direct Deposit',
  [ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID]: 'Disability Rating',
  [ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID]: 'Military Service History',
  [ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID]: 'Personal Information',
  [ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID]: 'Personal Information',
  [ScreenIDTypesConstants.PAYMENTS_SCREEN_ID]: 'Payments',
  [ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID]: 'VA Prescriptions',
}

export const ScreenIDToDowntimeFeatures = {
  [ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID]: [DowntimeFeatureTypeConstants.claims, DowntimeFeatureTypeConstants.appeals],
  [ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID]: [DowntimeFeatureTypeConstants.claims],
  [ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID]: [DowntimeFeatureTypeConstants.appointments],
  [ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID]: [DowntimeFeatureTypeConstants.secureMessaging],
  [ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID]: [DowntimeFeatureTypeConstants.secureMessaging],
  [ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID]: [DowntimeFeatureTypeConstants.letters],
  [ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID]: [DowntimeFeatureTypeConstants.directDepositBenefits],
  [ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID]: [DowntimeFeatureTypeConstants.disabilityRating],
  [ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID]: [DowntimeFeatureTypeConstants.militaryServiceHistory],
  [ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID]: [DowntimeFeatureTypeConstants.userProfileUpdate],
  [ScreenIDTypesConstants.CONTACT_INFORMATION_SCREEN_ID]: [DowntimeFeatureTypeConstants.userProfileUpdate],
  [ScreenIDTypesConstants.PAYMENTS_SCREEN_ID]: [DowntimeFeatureTypeConstants.payments],
  [ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID]: [DowntimeFeatureTypeConstants.rx],
}

export type MaintenanceWindowsGetData = {
  data: MaintenanceWindowsEntry[]
}

export type MaintenanceWindowsEntry = {
  attributes: {
    service: DowntimeFeatureType
    startTime: string
    endTime: string
  }
  id: string
  type: string
}

export type ErrorObject = {
  code?: string
} & Error &
  APIError
