import {
  AppointmentsGetData,
  DirectDepositData,
  EditResponseData,
  LettersData,
  MilitaryServiceHistoryData,
  PhoneData,
  PhoneType,
  PhoneTypeConstants,
  ProfileFormattedFieldType,
  UserData,
} from '../types'
import { DateTime } from 'luxon'
import { Params } from '../api'

/**
 * Type denoting the demo data store
 */
export type DemoStore = {
  '/v0/user': UserData
  '/v0/military-service-history': MilitaryServiceHistoryData
  '/v0/letters': LettersData
  '/v0/payment-information/benefits': DirectDepositData
  '/v0/appointments': {
    past: AppointmentsGetData
    upcoming: AppointmentsGetData
  }
}

/**
 * Type to define the mock returns to keep type safety
 */
type DemoApiReturns = undefined | UserData | AppointmentsGetData | MilitaryServiceHistoryData | LettersData | DirectDepositData | EditResponseData
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
  const data = await import('./demo.json')
  setDemoStore((data.default as unknown) as DemoStore)
}

/**
 * constant to mock the return data for any of the profile updates
 */
const MOCK_EDIT_RESPONSE = {
  data: {
    attributes: {
      id: 'mock_id',
      type: 'mock_type',
      attributes: {
        transactionId: 'mock_transaction',
        transactionStatus: 'great!',
        type: 'success',
        metadata: [
          {
            code: '42',
            key: 'TSTLTUAE',
            retryable: 'no',
            severity: 'none',
            text: 'great job team',
          },
        ],
      },
    },
  },
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
  switch (endpoint) {
    case '/v0/appointments': {
      const endDate = params.endDate
      if (endDate && typeof endDate === 'string') {
        if (DateTime.fromISO(endDate) < DateTime.now()) {
          return store?.['/v0/appointments'].past
        } else {
          return store?.['/v0/appointments'].upcoming
        }
      } else {
        return undefined
      }
    }
    default: {
      if (store && endpoint in store) {
        const k = endpoint as keyof DemoStore
        return store[k] as DemoApiReturns
      } else {
        return undefined
      }
    }
  }
}

/**
 * function to handle transforming POST calls to update store data
 * @param endpoint- api endpoint being mocked
 * @param params- POST params that will be used to update the demo store.
 */
const transformPostCall = (endpoint: string, params: Params): DemoApiReturns => {
  switch (endpoint) {
    case '/v0/user/phones': {
      return updateUserPhone(params)
    }
    case '/v0/user/emails': {
      return updateEmail(params.emailAddress as string)
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
  switch (endpoint) {
    case '/v0/user/phones': {
      return updateUserPhone(params)
    }
    case '/v0/user/emails': {
      return updateEmail(params.emailAddress as string)
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
    case '/v0/user/phones': {
      const { phoneType } = params
      const [type, formattedType] = getPhoneTypes(phoneType as PhoneType)
      store['/v0/user'].data.attributes.profile[type] = {
        areaCode: '',
        countryCode: '',
        phoneNumber: '',
        phoneType: phoneType as PhoneType,
      }
      store['/v0/user'].data.attributes.profile[formattedType] = undefined
      return MOCK_EDIT_RESPONSE
    }
    case '/v0/user/emails': {
      // @ts-ignore if it isnt set to null there is an error
      store['/v0/user'].data.attributes.profile.contactEmail = null
      return MOCK_EDIT_RESPONSE
    }
    default: {
      return undefined
    }
  }
}

/**
 * Function used to update the user's phone numbers. This avoids reuse for the PUT/POST calls required for phones
 * @param params- PU/POST params that will be used to update the demo store.
 */
const updateUserPhone = (params: Params): EditResponseData | undefined => {
  if (!store) {
    return undefined
  }
  const { phoneType } = params
  const [type, formattedType] = getPhoneTypes(phoneType as PhoneType)

  store['/v0/user'].data.attributes.profile[type] = (params as unknown) as PhoneData
  const { areaCode, phoneNumber } = params
  store['/v0/user'].data.attributes.profile[formattedType] = `${areaCode} + ${phoneNumber}`
  return MOCK_EDIT_RESPONSE
}

/**
 * type to hold phone keys in UserDataProfile type to keep phone updates typesafe
 */
type PhoneKeyUnion = 'homePhoneNumber' | 'mobilePhoneNumber' | 'workPhoneNumber' | 'faxNumber'

/**
 * function returns the tuple of the PhoneKeyUnion and ProfileFormattedFieldType to use as keys when updating the store
 * @param phoneType- PhoneType constant to get the correct profile keys for
 * @returns [PhoneKeyUnion, ProfileFormattedFieldType]- tuple of the phone keys for the profile object.
 */
const getPhoneTypes = (phoneType: PhoneType): [PhoneKeyUnion, ProfileFormattedFieldType] => {
  switch (phoneType) {
    case PhoneTypeConstants.HOME: {
      return ['homePhoneNumber', 'formattedHomePhone']
    }
    case PhoneTypeConstants.MOBILE: {
      return ['mobilePhoneNumber', 'formattedMobilePhone']
    }
    case PhoneTypeConstants.WORK: {
      return ['workPhoneNumber', 'formattedWorkPhone']
    }
    case PhoneTypeConstants.FAX: {
      return ['faxNumber', 'formattedFaxPhone']
    }
  }
  throw Error('Unexpected Phone type')
}

const updateEmail = (emailAddress: string): EditResponseData | undefined => {
  if (!store) {
    return undefined
  }
  store['/v0/user'].data.attributes.profile.contactEmail = {
    id: 'mock_id',
    emailAddress: emailAddress,
  }
  return MOCK_EDIT_RESPONSE
}
