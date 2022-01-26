import { AddressData, PaymentAccountData, SecureMessagingSystemFolderIdConstants } from '../types'
import { AppointmentDemoReturnTypes, AppointmentsDemoStore, getAppointments } from './appointments'
import { ClaimsDemoApiReturnTypes, ClaimsDemoStore, getClaimsAndAppealsOverview } from './claims'
import { DisabilityRatingDemoApiReturnTypes, DisabilityRatingDemoStore } from './disabilityRating'
import { Params } from '../api'
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
} from './profile'
import { SecureMessagingDemoApiReturnTypes, SecureMessagingDemoStore, getFolderMessages } from './secureMessaging'
import { VaccineDemoReturnTypes, VaccineDemoStore, getVaccineList } from './vaccine'

/**
 * Intersection type denoting the demo data store
 */
export type DemoStore = AppointmentsDemoStore & ClaimsDemoStore & ProfileDemoStore & SecureMessagingDemoStore & VaccineDemoStore & DisabilityRatingDemoStore

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

let store: DemoStore | undefined

/**
 * function to set the data store up when Demo Mode is triggered
 * @param data- store data deserialized from JSON file
 */
const setDemoStore = (data: DemoStore) => {
  store = data
}

/**
 * function to import the demo data store from the JSON file and initialize the demo store.
 */
export const initDemoStore = async (): Promise<void> => {
  const data = await Promise.all([
    import('./mocks/appointments.json'),
    import('./mocks/claims.json'),
    import('./mocks/profile.json'),
    import('./mocks/secureMessaging.json'),
    import('./mocks/vaccine.json'),
    import('./mocks/disablityRating.json'),
  ])
  setDemoStore(data.reduce((merged, current) => ({ ...merged, ...current }), {}) as unknown as DemoStore)
}

/**
 * This function mocks out all of the API calls and returns the mock data from DemoStore instance, rather than making the
 * actual API calls. Every call should be mocked if we want to display data and any call that updates store data will need
 * to have some sort of a transform case created. See the individual transform functions below for details.
 * @param callType- 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' string to tell the mock API what transform to run
 * @param endpoint- api endpoint being mocked
 * @param params- API params for the call
 */
export const transform = (callType: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: string, params: Params): DemoApiReturns => {
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
      store['/v0/payment-information/benefits'].data.attributes.paymentAccount = params as unknown as PaymentAccountData
      return directDepositTransform(params as unknown as PaymentAccountData)
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
