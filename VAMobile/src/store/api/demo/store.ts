import { DateTime } from 'luxon'

import {
  AddressData,
  PaymentAccountData,
  PreferredNameUpdatePayload,
  SecureMessagingSystemFolderIdConstants,
  SubmitSMOCTravelPayClaimParameters,
} from 'api/types'
import { Params } from 'store/api/api'
import { AllergyDemoReturnTypes, AllergyDemoStore, getAllergyList } from 'store/api/demo/allergies'
import { AppointmentDemoReturnTypes, AppointmentsDemoStore, getAppointments } from 'store/api/demo/appointments'
import { ClaimsDemoApiReturnTypes, ClaimsDemoStore, getClaimsAndAppealsOverview } from 'store/api/demo/claims'
import { DebtsDemoReturnTypes, DebtsDemoStore, getDebts } from 'store/api/demo/debts'
import { DecisionLettersDemoApiReturnTypes, DecisionLettersDemoStore } from 'store/api/demo/decisionLetters'
import { DemographicsDemoApiReturnTypes, DemographicsDemoStore, updatePreferredName } from 'store/api/demo/demographics'
import { DisabilityRatingDemoApiReturnTypes, DisabilityRatingDemoStore } from 'store/api/demo/disabilityRating'
import { LabsAndTestsDemoReturnTypes, LabsAndTestsDemoStore, getLabsAndTestsList } from 'store/api/demo/labsAndTests'
import { LettersDemoApiReturnTypes, LettersDemoStore } from 'store/api/demo/letters'
import { MedicalCopaysDemoReturnTypes, MedicalCopaysDemoStore, getMedicalCopays } from 'store/api/demo/medicalCopays'
import importBenjaminAdamsData from 'store/api/demo/mocks/benjaminAdams'
import importClaraJeffersonData from 'store/api/demo/mocks/claraJefferson'
import importDennisMadisonData from 'store/api/demo/mocks/dennisMadison'
import importJohnMonroeData from 'store/api/demo/mocks/johnMonroe'
import importKimberlyWashingtonData from 'store/api/demo/mocks/kimberlyWashington'
import { NotificationDemoApiReturnTypes, NotificationDemoStore } from 'store/api/demo/notifications'
import { PaymenDemoStore, PaymentsDemoReturnTypes, getPaymentsHistory } from 'store/api/demo/payments'
import { PrescriptionsDemoReturnTypes, PrescriptionsDemoStore, getPrescriptions } from 'store/api/demo/prescriptions'
import {
  ProfileDemoReturnTypes,
  ProfileDemoStore,
  deleteAddress,
  deleteEmail,
  deleteUserPhone,
  directDepositTransform,
  updateAddress,
  updateEmail,
  updateUserPhone,
  validateAddress,
} from 'store/api/demo/profile'
import {
  SecureMessagingDemoApiReturnTypes,
  SecureMessagingDemoStore,
  getFolderMessages,
} from 'store/api/demo/secureMessaging'
import {
  TravelPayDemoReturnTypes,
  TravelPayDemoStore,
  getTravelPayClaims,
  submitAppointmentClaim,
} from 'store/api/demo/travelPay'
import { VaccineDemoReturnTypes, VaccineDemoStore, getVaccineList } from 'store/api/demo/vaccine'

/**
 * Intersection type denoting the demo data store
 */
export type DemoStore = AppointmentsDemoStore &
  ClaimsDemoStore &
  ProfileDemoStore &
  SecureMessagingDemoStore &
  VaccineDemoStore &
  DisabilityRatingDemoStore &
  DecisionLettersDemoStore &
  LettersDemoStore &
  PaymenDemoStore &
  PrescriptionsDemoStore &
  NotificationDemoStore &
  DemographicsDemoStore &
  AllergyDemoStore &
  LabsAndTestsDemoStore &
  TravelPayDemoStore &
  MedicalCopaysDemoStore &
  DebtsDemoStore

/**
 * Union type to define the mock returns to keep type safety
 */
type DemoApiReturns =
  | ClaimsDemoApiReturnTypes
  | AppointmentDemoReturnTypes
  | ProfileDemoReturnTypes
  | SecureMessagingDemoApiReturnTypes
  | VaccineDemoReturnTypes
  | DisabilityRatingDemoApiReturnTypes
  | DecisionLettersDemoApiReturnTypes
  | LettersDemoApiReturnTypes
  | PaymentsDemoReturnTypes
  | PrescriptionsDemoReturnTypes
  | NotificationDemoApiReturnTypes
  | DemographicsDemoApiReturnTypes
  | AllergyDemoReturnTypes
  | LabsAndTestsDemoReturnTypes
  | TravelPayDemoReturnTypes
  | MedicalCopaysDemoReturnTypes
  | DebtsDemoReturnTypes

let store: DemoStore | undefined

/**
 * function to set the data store up when Demo Mode is triggered
 * @param data- store data deserialized from JSON file
 */
const setDemoStore = (data: DemoStore) => {
  store = data
}

/**
 * Replace double curly brace date expression in mock file with ISO date.
 * For example, \{\{now + 5 days\}\} is replaced with 2023-08-08T10:58:58.003-06:00
 * (Ignore the backslashes, they're just for JSDoc.)
 * Units can be days, weeks, months, or years, and you can add or subtract.
 * You can add an optional format at the end. Options:
 *   short: month-day-year (05-30-2023)
 *   shortReversed: year-month-day (2023-07-11)
 *   year: year only (2023)
 *   utc: timestamp in UTC time (2023-08-10T22:04:16.695Z)
 *   (default): timestamp in local timezone (2023-11-08T16:04:16.693-07:00)
 */
const generateDate = (match: string, signSymbol: string, offset: string, units: string, format: string) => {
  const sign = signSymbol === '+' ? 'plus' : 'minus'
  let result = ''

  try {
    const localNow = DateTime.now()[sign]({ [units]: offset })
    if (format === 'short') {
      result = localNow.toFormat('MM-dd-yyyy')
    } else if (format === 'shortReversed') {
      result = localNow.toFormat('yyyy-MM-dd')
    } else if (format === 'year') {
      result = localNow.toFormat('yyyy')
    } else if (format === 'utc') {
      result = DateTime.utc()
        [sign]({ [units]: offset })
        .toISO()
    } else {
      result = localNow.toString()
    }
  } catch (error) {
    console.log(`Error in mock file date expression ${match}: ${error}`)
  }

  return result
}

/**
 * Replace all the date expressions in a mock file with the corresponding dates
 */
const transformDates = (fileObject: Record<string, unknown>) => {
  return JSON.parse(JSON.stringify(fileObject).replace(/{{now (\+|-) (\d+) (\w+) ?(\w+)?}}/g, generateDate))
}

/**
 * function to import the demo data store from the JSON file and initialize the demo store.
 */
export const initDemoStore = async (demoUser: string | null = 'kimberlyWashington'): Promise<void> => {
  let userData
  switch (demoUser) {
    case 'benjaminAdams':
      userData = importBenjaminAdamsData()
      break
    case 'johnMonroe':
      userData = importJohnMonroeData()
      break
    case 'claraJefferson':
      userData = importClaraJeffersonData()
      break
    case 'dennisMadison':
      userData = importDennisMadisonData()
      break
    case 'kimberlyWashington':
    default:
      userData = importKimberlyWashingtonData()
  }

  const data = await Promise.all(userData)
  const transformedData = data.map((file) => transformDates(file))
  setDemoStore(transformedData.reduce((merged, current) => ({ ...merged, ...current }), {}) as unknown as DemoStore)
}

/**
 * This function mocks out all of the API calls and returns the mock data from DemoStore instance, rather than making the
 * actual API calls. Every call should be mocked if we want to display data and any call that updates store data will need
 * to have some sort of a transform case created. See the individual transform functions below for details.
 * @param callType- 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' string to tell the mock API what transform to run
 * @param endpoint- api endpoint being mocked
 * @param params- API params for the call
 */
export const transform = (
  callType: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
  endpoint: string,
  params: Params,
): DemoApiReturns => {
  switch (callType) {
    case 'GET': {
      return transformGetCall(endpoint, params)
    }
    case 'POST': {
      return transformPostCall(endpoint, params)
    }
    case 'PUT': {
      return transformPutCall(endpoint, params)
    }
    case 'DELETE': {
      return transformDeleteCall(endpoint, params)
    }
    default: {
      return undefined
    }
  }
}

/**
 function to handle transforming GET calls to update store data
 * @param endpoint- api endpoint being mocked
 * @param params- GET params that will be used to update the demo store.
 */
const transformGetCall = (endpoint: string, params: Params): DemoApiReturns => {
  if (!store) {
    return undefined
  }

  if (endpoint.startsWith('/v0/push/prefs/')) {
    return store['/v0/push/prefs'] as DemoApiReturns
  }

  switch (endpoint) {
    /**
     * APPOINTMENTS
     */
    case '/v0/appointments': {
      return getAppointments(store, params)
    }
    /**
     * CLAIMS
     */
    case '/v0/claims-and-appeals-overview': {
      return getClaimsAndAppealsOverview(store, params)
    }
    /**
     * Secure Messaging
     */
    case `/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`:
    case `/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`: {
      return getFolderMessages(store, params, endpoint)
    }
    case '/v1/health/immunizations': {
      return getVaccineList(store, params, endpoint)
    }
    case '/v1/health/labs-and-tests': {
      return getLabsAndTestsList(store, params)
    }
    case '/v0/health/allergy-intolerances': {
      return getAllergyList(store, params, endpoint)
    }
    case '/v0/payment-history': {
      return getPaymentsHistory(store, params, endpoint)
    }
    case '/v0/health/rx/prescriptions': {
      return getPrescriptions(store, params, endpoint)
    }
    /**
     * TRAVEL PAY
     */
    case '/v0/travel-pay/claims': {
      return getTravelPayClaims(store, params)
    }
    case '/v0/medical_copays': {
      return getMedicalCopays(store, params, endpoint)
    }
    case '/v0/debts': {
      return getDebts(store, params, endpoint)
    }
    default: {
      return store?.[endpoint as keyof DemoStore] as DemoApiReturns
    }
  }
}

/**
 * function to handle transforming POST calls to update store data
 * @param endpoint- api endpoint being mocked
 * @param params- POST params that will be used to update the demo store.
 */
const transformPostCall = (endpoint: string, params: Params): DemoApiReturns => {
  if (!store) {
    return undefined
  }

  switch (endpoint) {
    /**
     * USER PROFILE
     */
    case '/v0/user/phones': {
      return updateUserPhone(store, params)
    }
    case '/v0/user/emails': {
      return updateEmail(store, params.emailAddress as string)
    }
    case '/v0/user/addresses/validate': {
      return validateAddress(params as unknown as AddressData)
    }
    case '/v0/user/addresses': {
      return updateAddress(store, params as unknown as AddressData)
    }
    /**
     * TRAVEL PAY
     */
    case '/v0/travel-pay/claims': {
      return submitAppointmentClaim(params as unknown as SubmitSMOCTravelPayClaimParameters)
    }
    default: {
      return undefined
    }
  }
}

/**
 * function to handle transforming PUT calls to update store data
 * @param endpoint- api endpoint being mocked
 * @param params- PUT params that will be used to update the demo store.
 */
const transformPutCall = (endpoint: string, params: Params): DemoApiReturns => {
  if (!store) {
    return undefined
  }
  switch (endpoint) {
    /**
     * USER PROFILE
     */
    case '/v0/user/phones': {
      return updateUserPhone(store, params)
    }
    case '/v0/user/emails': {
      return updateEmail(store, params.emailAddress as string)
    }
    case '/v0/user/addresses': {
      return updateAddress(store, params as unknown as AddressData)
    }
    case '/v0/payment-information/benefits': {
      return directDepositTransform(store, params as unknown as PaymentAccountData)
    }
    /**
     * Demographics
     */
    case '/v0/user/preferred_name': {
      return updatePreferredName(store, params as PreferredNameUpdatePayload)
    }
    default: {
      return undefined
    }
  }
}

/**
 * function to handle transforming DELETE calls to update store data
 * @param endpoint- api endpoint being mocked
 * @param params- DELETE params that will be used to update the demo store.
 */
const transformDeleteCall = (endpoint: string, params: Params): DemoApiReturns => {
  if (!store) {
    return undefined
  }
  switch (endpoint) {
    /**
     * USER PROFILE
     */
    case '/v0/user/phones': {
      return deleteUserPhone(store, params)
    }
    case '/v0/user/emails': {
      return deleteEmail(store)
    }
    case '/v0/user/addresses': {
      return deleteAddress(store, params)
    }
    default: {
      return undefined
    }
  }
}
