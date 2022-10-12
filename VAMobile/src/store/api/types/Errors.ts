// parent level error object that contains the status, text, and json properties from a fetch response stream
// used to keep full error information in respective stores
// json property is used to parse through to find error metadata
import { ScreenIDTypes, ScreenIDTypesConstants } from 'store/api/types/Screens'
import { invert } from 'underscore'

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

// Friendly names shown in downtime messages
export const DowntimeFeatureNameConstants = {
  [DowntimeFeatureTypeConstants.facilityLocator]: 'Facility Locator',
  [DowntimeFeatureTypeConstants.claims]: 'Claims',
  [DowntimeFeatureTypeConstants.appointments]: 'Appointments',
  [DowntimeFeatureTypeConstants.secureMessaging]: 'Secure Messaging',
  [DowntimeFeatureTypeConstants.letters]: 'Letters',
  [DowntimeFeatureTypeConstants.directDepositBenefits]: 'Direct Deposit',
  [DowntimeFeatureTypeConstants.disabilityRating]: 'Disability Rating',
  [DowntimeFeatureTypeConstants.militaryServiceHistory]: 'Military Service History',
  [DowntimeFeatureTypeConstants.appeals]: 'Appeals',
  [DowntimeFeatureTypeConstants.userProfileUpdate]: 'Personal Information',
  [DowntimeFeatureTypeConstants.payments]: 'Payments',
  [DowntimeFeatureTypeConstants.rx]: 'VA Prescriptions',
}

// which screen to show which downtime message on
export const DowntimeFeatureToScreenID = {
  // TODO: Find a proper page conversion for facility locator to display downtime
  [DowntimeFeatureTypeConstants.claims]: ScreenIDTypesConstants.CLAIMS_SCREEN_ID,
  [DowntimeFeatureTypeConstants.appointments]: ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID,
  [DowntimeFeatureTypeConstants.secureMessaging]: ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID,
  [DowntimeFeatureTypeConstants.letters]: ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID,
  [DowntimeFeatureTypeConstants.directDepositBenefits]: ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID,
  [DowntimeFeatureTypeConstants.disabilityRating]: ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID,
  [DowntimeFeatureTypeConstants.militaryServiceHistory]: ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID,
  // it was determined that claims and appeals would be interconnected and downtime for either would block both
  [DowntimeFeatureTypeConstants.appeals]: ScreenIDTypesConstants.CLAIMS_SCREEN_ID,
  [DowntimeFeatureTypeConstants.userProfileUpdate]: ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID,
  [DowntimeFeatureTypeConstants.payments]: ScreenIDTypesConstants.PAYMENTS_SCREEN_ID,
  [DowntimeFeatureTypeConstants.rx]: ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID,
}

export const DowntimeScreenIDToFeature: DowntimeScreenIDToFeatureType = invert(DowntimeFeatureToScreenID)

export type DowntimeScreenIDToFeatureType = {
  [key in ScreenIDTypes]: DowntimeFeatureType
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
