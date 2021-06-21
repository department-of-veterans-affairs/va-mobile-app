import {
  AppointmentsGetData,
  DirectDepositData,
  EditResponseData,
  LettersData,
  MilitaryServiceHistoryData,
  PhoneData,
  ProfileFormattedFieldType,
  UserData,
  UserDataProfile,
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
      return updateUserPhone(params, 'mocked_phone_id')
    }
    default: {
      return undefined
    }
  }
}

/**
 * Function used to update the user's phone numbers. This avoids reuse for the PUT/POST calls required for phones
 * @param params- PU/POST params that will be used to update the demo store.
 * @param id- id string of the phone number. 'mocked_phone_id' is used for POST mocks
 */
const updateUserPhone = (params: Params, id: string): EditResponseData | undefined => {
  const { phoneType } = params
  let type: keyof UserDataProfile
  let formattedType: ProfileFormattedFieldType
  switch (phoneType) {
    case 'HOME': {
      type = 'homePhoneNumber'
      formattedType = 'formattedHomePhone'
      break
    }
    case 'MOBILE': {
      type = 'mobilePhoneNumber'
      formattedType = 'formattedMobilePhone'
      break
    }
    case 'WORK': {
      type = 'workPhoneNumber'
      formattedType = 'formattedWorkPhone'
      break
    }
    case 'FAX': {
      type = 'faxNumber'
      formattedType = 'formattedFaxPhone'
      break
    }
    default: {
      return undefined
    }
  }
  if (store) {
    store['/v0/user'].data.attributes.profile[type] = (params as unknown) as PhoneData
    const { areaCode, phoneNumber } = params
    store['/v0/user'].data.attributes.profile[formattedType] = `${areaCode} + ${phoneNumber}`
    return {
      data: {
        attributes: {
          id: id as string,
          type: phoneType,
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
  } else {
    return undefined
  }
}
