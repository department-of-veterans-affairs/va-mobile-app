import {
  AddressData,
  AddressValidationData,
  DeliveryPointValidationTypesConstants,
  DirectDepositData,
  EditResponseData,
  LettersData,
  MilitaryServiceHistoryData,
  PaymentAccountData,
  PhoneData,
  PhoneType,
  PhoneTypeConstants,
  ProfileFormattedFieldType,
  UserData,
  addressPouTypes,
} from '../types'
import { DemoStore } from './store'
import { MOCK_EDIT_RESPONSE } from './utils'
import { Params } from '../api'

/**
 * Type denoting the demo data store
 */
export type ProfileDemoStore = {
  '/v0/military-service-history': MilitaryServiceHistoryData
  '/v0/letters': LettersData
  '/v0/payment-information/benefits': DirectDepositData
  '/v0/user': UserData
}

/**
 * Type to define the mock returns to keep type safety
 */
export type ProfileDemoReturnTypes = AddressValidationData | DirectDepositData | DirectDepositData | EditResponseData | LettersData | MilitaryServiceHistoryData | UserData

/**
 * Function used to update the user's phone numbers. This avoids reuse for the PUT/POST calls required for phones
 * @param params- PUT/POST params that will be used to update the demo store.
 */
export const updateUserPhone = (store: DemoStore, params: Params): EditResponseData => {
  const { phoneType } = params
  const [type, formattedType] = getPhoneTypes(phoneType as PhoneType)

  store['/v0/user'].data.attributes.profile[type] = params as unknown as PhoneData
  const { areaCode, phoneNumber } = params
  store['/v0/user'].data.attributes.profile[formattedType] = `${areaCode} + ${phoneNumber}`
  return MOCK_EDIT_RESPONSE
}

/**
 * Function used to delete the user's phone number
 * @param params- DELETE params that will be used to update the demo store.
 */
export const deleteUserPhone = (store: DemoStore, params: Params): EditResponseData | undefined => {
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

/**
 * function to update contact email in demo state
 * @param emailAddress- new email address to use
 */
export const updateEmail = (store: DemoStore, emailAddress: string): EditResponseData => {
  store['/v0/user'].data.attributes.profile.contactEmail = {
    id: 'mock_id',
    emailAddress: emailAddress,
  }
  return MOCK_EDIT_RESPONSE
}

/**
 * function to delete contact email in demo state
 */
export const deleteEmail = (store: DemoStore): EditResponseData => {
  // @ts-ignore if it isnt set to null there is an error
  store['/v0/user'].data.attributes.profile.contactEmail = null
  return MOCK_EDIT_RESPONSE
}

/**
 * function mocks the address validation call when updating address
 * @param addressData- AddressData to transform into the AddressValidationData object
 * @returns AddressValidationData- object needed to run the validation to complete address updates
 */
export const validateAddress = (addressData: AddressData): AddressValidationData => {
  const { id, addressLine1, addressLine2, addressLine3, addressPou, addressType, city, countryCodeIso3, internationalPostalCode, province, stateCode, zipCode, zipCodeSuffix } =
    addressData
  return {
    data: [
      {
        id: `${id}`,
        type: 'mock_type',
        attributes: {
          addressLine1,
          addressLine2,
          addressLine3,
          addressPou,
          addressType,
          city,
          countryCodeIso3,
          internationalPostalCode: internationalPostalCode || '',
          province: province || '',
          stateCode: stateCode || '',
          zipCode,
          zipCodeSuffix: zipCodeSuffix || '',
        },
        meta: {
          address: {
            confidenceScore: 42,
            addressType: addressData.addressType,
            deliveryPointValidation: DeliveryPointValidationTypesConstants.CONFIRMED,
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          validationKey: 315989,
        },
      },
    ],
  }
}

/**
 * this type maps the address keys in UserData to use when updating the store
 */
type AddressTypeKey = 'residentialAddress' | 'mailingAddress'

/**
 * Function to get the correct key in profile to update address
 * @param pouType- POU string of the address to update
 * @returns AddressTypeKey- returns the string key for profile of the address being updated.
 */
const getAddressType = (pouType: addressPouTypes): AddressTypeKey => {
  return pouType === 'RESIDENCE/CHOICE' ? 'residentialAddress' : 'mailingAddress'
}

/**
 * Function updates the selected address in the demo store
 * @param address- AddressData object to update
 */
export const updateAddress = (store: DemoStore, address: AddressData): EditResponseData => {
  const type = getAddressType(address.addressPou)
  store['/v0/user'].data.attributes.profile[type] = address
  return MOCK_EDIT_RESPONSE
}

/**
 * Function deletes the selected address in the demo store
 * @param address- AddressData object to update
 */
export const deleteAddress = (store: DemoStore, params: Params): EditResponseData => {
  const type = getAddressType((params as unknown as AddressData).addressPou)
  store['/v0/user'].data.attributes.profile[type] = undefined
  return MOCK_EDIT_RESPONSE
}

/**
 * function transforms PaymentAccountData to DirectDepositData for use in updating DD calls
 * @param paymentData- PaymentAccountData object to update DD info
 * @returns DirectDepositData- transformed object from paymentData for use in PUT updates in direct deposit actions
 */
export const directDepositTransform = (paymentData: PaymentAccountData): DirectDepositData => {
  return {
    data: {
      type: paymentData.accountType,
      id: 'mock_id',
      attributes: {
        paymentAccount: paymentData,
      },
    },
  }
}
