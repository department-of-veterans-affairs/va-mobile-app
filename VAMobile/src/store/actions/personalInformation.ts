import * as api from 'store/api'
import { AddressData, AddressValidationScenarioTypes, PhoneData, PhoneType, ProfileFormattedFieldType, ScreenIDTypes, UserDataProfile, addressPouTypes } from 'store/api/types'
import { AsyncReduxAction, ReduxAction } from '../types'
import { SuggestedAddress, VAServices } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getAddressValidationScenarioFromAddressValidationData, getSuggestedAddresses, getValidationKey, showValidationScreen } from 'utils/personalInformation'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { omit } from 'underscore'
import { profileAddressType } from 'screens/ProfileScreen/AddressSummary'

const dispatchStartGetProfileInfo = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_GET_INFO',
    payload: {},
  }
}

const dispatchFinishGetProfileInfo = (profile?: api.UserDataProfile, error?: Error): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_GET_INFO',
    payload: {
      profile,
      error,
    },
  }
}

const dispatchUpdateAuthorizedServices = (authorizedServices?: Array<VAServices>, error?: Error): ReduxAction => {
  return {
    type: 'AUTHORIZED_SERVICES_UPDATE',
    payload: {
      authorizedServices,
      error,
    },
  }
}

export const dispatchProfileLogout = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_ON_LOGOUT',
    payload: {},
  }
}

export const getProfileInfo = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getProfileInfo(screenID))))

    try {
      dispatch(dispatchStartGetProfileInfo())
      const user = await api.get<api.UserData>('/v0/user')

      // TODO: delete in story #19175
      if (user?.data.attributes.profile.signinEmail === 'vets.gov.user+1401@gmail.com') {
        throw { status: 408 }
      }

      dispatch(dispatchFinishGetProfileInfo(user?.data.attributes.profile))
      dispatch(dispatchUpdateAuthorizedServices(user?.data.attributes.authorizedServices))
    } catch (error) {
      dispatch(dispatchFinishGetProfileInfo(undefined, error))
      dispatch(dispatchUpdateAuthorizedServices(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchFinishEditPhoneNumber = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER',
    payload: {},
  }
}

const dispatchStartSavePhoneNumber = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER',
    payload: {},
  }
}

const dispatchFinishSavePhoneNumber = (error?: Error): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER',
    payload: { error },
  }
}

const PhoneTypeToFormattedNumber: {
  [key in PhoneType]: ProfileFormattedFieldType
} = {
  HOME: 'formattedHomePhone',
  MOBILE: 'formattedMobilePhone',
  WORK: 'formattedWorkPhone',
  FAX: 'formattedFaxPhone',
}

/**
 * Redux action to update the users phone number
 *
 * @param phoneType - string specifying the type of number being updated (can be HOME, WORK, MOBILE, or FAX)
 * @param phoneNumber - string of numbers signifying area code and phone number
 * @param extension - string of numbers signifying extension number
 * @param numberId - number indicating the id of the phone number
 * @param screenID - ID used to compare within the component to see if an error component needs to be rendered
 *
 * @returns AsyncReduxAction
 */
export const editUsersNumber = (phoneType: PhoneType, phoneNumber: string, extension: string, numberId: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(editUsersNumber(phoneType, phoneNumber, extension, numberId, screenID))))

    try {
      dispatch(dispatchStartSavePhoneNumber())

      const profile = getState().personalInformation.profile
      // if formatted number doesnt exist call post endpoint instead
      const createEntry = !(profile || {})[PhoneTypeToFormattedNumber[phoneType] as keyof UserDataProfile]

      let updatedPhoneData: PhoneData = {
        areaCode: phoneNumber.substring(0, 3),
        countryCode: '1',
        phoneNumber: phoneNumber.substring(3),
        phoneType: phoneType,
      }

      // Add extension only if it exist
      if (extension) {
        updatedPhoneData = {
          ...updatedPhoneData,
          extension,
        }
      }

      if (createEntry) {
        await api.post<api.EditResponseData>('/v0/user/phones', (updatedPhoneData as unknown) as api.Params)
      } else {
        const updatedPutPhoneData = {
          ...updatedPhoneData,
          id: numberId,
        }
        await api.put<api.EditResponseData>('/v0/user/phones', (updatedPutPhoneData as unknown) as api.Params)
      }

      dispatch(dispatchFinishSavePhoneNumber())
    } catch (err) {
      console.error(err)
      dispatch(dispatchFinishSavePhoneNumber(err))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
    }
  }
}

/**
 * Redux action for leaving the phone number edit mode
 */
export const finishEditPhoneNumber = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchFinishEditPhoneNumber())
  }
}

const dispatchStartSaveEmail = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL',
    payload: {},
  }
}

const dispatchFinishSaveEmail = (error?: Error): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL',
    payload: { error },
  }
}

const dispatchFinishEditEmail = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_EDIT_EMAIL',
    payload: {},
  }
}

/**
 * Redux action to make the API call to update a users email
 */
export const updateEmail = (email?: string, emailId?: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    try {
      dispatch(dispatchClearErrors())
      dispatch(dispatchSetTryAgainFunction(() => dispatch(updateEmail(email, emailId, screenID))))
      dispatch(dispatchStartSaveEmail())

      // if it doesnt exist call post endpoint instead
      const createEntry = !getState().personalInformation.profile?.contactEmail?.emailAddress

      if (createEntry) {
        await api.post<api.EditResponseData>('/v0/user/emails', ({ emailAddress: email } as unknown) as api.Params)
      } else {
        const emailUpdateData = {
          id: emailId,
          emailAddress: email,
        }
        await api.put<api.EditResponseData>('/v0/user/emails', (emailUpdateData as unknown) as api.Params)
      }

      dispatch(dispatchFinishSaveEmail())
    } catch (err) {
      dispatch(dispatchFinishSaveEmail(err))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
    }
  }
}

/**
 * Redux action for exiting the email edit mode
 */
export const finishEditEmail = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchFinishEditEmail())
  }
}

const dispatchStartSaveAddress = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS',
    payload: {},
  }
}

const dispatchFinishSaveAddress = (error?: Error): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS',
    payload: { error },
  }
}

const dispatchFinishEditAddress = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS',
    payload: {},
  }
}

const AddressPouToProfileAddressFieldType: {
  [key in addressPouTypes]: profileAddressType
} = {
  ['RESIDENCE/CHOICE']: 'residentialAddress',
  CORRESPONDENCE: 'mailingAddress',
}

/**
 * Redux action to make the API call to update a users address
 */
export const updateAddress = (addressData: AddressData, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(updateAddress(addressData, screenID))))

    try {
      dispatch(dispatchStartSaveAddress())

      const addressPou = addressData.addressPou
      const addressFieldType = AddressPouToProfileAddressFieldType[addressPou]
      const profile = getState().personalInformation.profile

      // if address doesnt exist call post endpoint instead
      const createEntry = !(profile || {})[addressFieldType as keyof UserDataProfile]

      if (createEntry) {
        const postAddressDataPayload = omit(addressData, 'id')
        await api.post<api.EditResponseData>('/v0/user/addresses', (postAddressDataPayload as unknown) as api.Params)
      } else {
        await api.put<api.EditResponseData>('/v0/user/addresses', (addressData as unknown) as api.Params)
      }

      dispatch(dispatchFinishSaveAddress())
    } catch (err) {
      dispatch(dispatchFinishSaveAddress(err))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
    }
  }
}

const dispatchStartValidateAddress = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_VALIDATE_ADDRESS',
    payload: {},
  }
}

const dispatchFinishValidateAddress = (
  suggestedAddresses?: Array<SuggestedAddress>,
  addressData?: AddressData,
  addressValidationScenario?: AddressValidationScenarioTypes,
): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS',
    payload: {
      suggestedAddresses,
      addressData,
      addressValidationScenario,
    },
  }
}

/**
 * Redux action to make the API call to validate a users address
 */
export const validateAddress = (addressData: AddressData, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(validateAddress(addressData, screenID))))

    try {
      dispatch(dispatchStartValidateAddress())
      const validationResponse = await api.post<api.AddressValidationData>('/v0/user/addresses/validate', (addressData as unknown) as api.Params)
      const suggestedAddresses = getSuggestedAddresses(validationResponse)
      const validationKey = getValidationKey(suggestedAddresses)

      if (showValidationScreen(addressData, suggestedAddresses)) {
        const addressValidationScenario = getAddressValidationScenarioFromAddressValidationData(suggestedAddresses, validationKey)
        dispatch(dispatchFinishValidateAddress(suggestedAddresses, addressData, addressValidationScenario))
      } else {
        addressData.addressMetaData = validationResponse?.data[0]?.meta?.address
        addressData.validationKey = validationKey
        dispatch(dispatchFinishValidateAddress())
        await dispatch(updateAddress(addressData, screenID))
      }
    } catch (err) {
      dispatch(dispatchFinishValidateAddress())
      dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
    }
  }
}

/**
 * Redux action for exiting the address edit mode
 */
export const finishEditAddress = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchFinishEditAddress())
  }
}
