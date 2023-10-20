import {
  AddressData,
  AddressValidationData,
  ContactInformationPayload,
  DeliveryPointValidationTypesConstants,
  FormattedPhoneType,
  PhoneData,
  PhoneKey,
  PhoneType,
  PhoneTypeConstants,
  addressPouTypes,
} from 'api/types'
import { DemoStore } from './store'
import { DirectDepositData, EditResponseData, LettersData, MilitaryServiceHistoryData, PaymentAccountData } from '../types'
import { MOCK_EDIT_RESPONSE } from './utils'
import { Params } from '../api'

/**
 * Type denoting the demo data store
 */
export type ProfileDemoStore = {
  '/v0/military-service-history': MilitaryServiceHistoryData
  '/v0/letters': LettersData
  '/v0/payment-information/benefits': DirectDepositData
  '/v0/user/contact-info': ContactInformationPayload
}

/**
 * Type to define the mock returns to keep type safety
 */
export type ProfileDemoReturnTypes = AddressValidationData | DirectDepositData | DirectDepositData | EditResponseData | LettersData | MilitaryServiceHistoryData

/**
 * Function used to update the user's phone numbers. This avoids reuse for the PUT/POST calls required for phones
 * @param params- PUT/POST params that will be used to update the demo store.
 */
export const updateUserPhone = (store: DemoStore, params: Params): EditResponseData => {
  const { phoneType } = params
  const [type] = getPhoneTypes(phoneType as PhoneType)

  store['/v0/user/contact-info'].data.attributes[type] = params as unknown as PhoneData
  return MOCK_EDIT_RESPONSE
}

/**
 * Function used to delete the user's phone number
 * @param params- DELETE params that will be used to update the demo store.
 */
export const deleteUserPhone = (store: DemoStore, params: Params): EditResponseData | undefined => {
  const { phoneType } = params
  const [type] = getPhoneTypes(phoneType as PhoneType)
  store['/v0/user/contact-info'].data.attributes[type] = null
  return MOCK_EDIT_RESPONSE
}

/**
 * function returns the tuple of the PhoneKeyUnion and ProfileFormattedFieldType to use as keys when updating the store
 * @param phoneType- PhoneType constant to get the correct profile keys for
 * @returns [PhoneKeyUnion, ProfileFormattedFieldType]- tuple of the phone keys for the profile object.
 */
const getPhoneTypes = (phoneType: PhoneType): [PhoneKey, FormattedPhoneType] => {
  switch (phoneType) {
    case PhoneTypeConstants.HOME: {
      return ['homePhone', 'formattedHomePhone']
    }
    case PhoneTypeConstants.MOBILE: {
      return ['mobilePhone', 'formattedMobilePhone']
    }
    case PhoneTypeConstants.WORK: {
      return ['workPhone', 'formattedWorkPhone']
    }
  }
  throw Error('Unexpected Phone type')
}

/**
 * function to update contact email in demo state
 * @param emailAddress- new email address to use
 */
export const updateEmail = (store: DemoStore, emailAddress: string): EditResponseData => {
  store['/v0/user/contact-info'].data.attributes.contactEmail = {
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
  store['/v0/user/contact-info'].data.attributes.contactEmail = null
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
  store['/v0/user/contact-info'].data.attributes[type] = address
  return MOCK_EDIT_RESPONSE
}

/**
 * Function deletes the selected address in the demo store
 * @param address- AddressData object to update
 */
export const deleteAddress = (store: DemoStore, params: Params): EditResponseData => {
  const type = getAddressType((params as unknown as AddressData).addressPou)
  store['/v0/user/contact-info'].data.attributes[type] = null
  return MOCK_EDIT_RESPONSE
}

/**
 * function transforms PaymentAccountData to DirectDepositData for use in updating DD calls
 * @param paymentData- PaymentAccountData object to update DD info
 * @returns DirectDepositData- transformed object from paymentData for use in PUT updates in direct deposit actions
 */
export const directDepositTransform = (store: DemoStore, paymentData: PaymentAccountData): DirectDepositData => {
  // Simulate masked bank account number returned by BE
  paymentData.accountNumber = paymentData.accountNumber
    .split('')
    .map((letter, i) => (i < paymentData.accountNumber.length - 4 ? '*' : letter))
    .join('')

  const data = {
    type: paymentData.accountType,
    id: 'mock_id',
    attributes: { paymentAccount: paymentData },
  }
  store['/v0/payment-information/benefits'].data = data

  return { data }
}
