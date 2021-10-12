import * as api from 'store/api'
import { AddressData, AddressValidationScenarioTypes, PhoneData, PhoneType, ProfileFormattedFieldType, ScreenIDTypes, UserDataProfile, addressPouTypes } from 'store/api/types'
import { AsyncReduxAction, ReduxAction } from '../types'
import { Events, UserAnalytics } from 'constants/analytics'
import { SuggestedAddress, VAServices } from 'store/api'
import { VAServicesConstants } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { dispatchUpdateHealth } from './health'
import {
  getAddressDataFromSuggestedAddress,
  getAddressValidationScenarioFromAddressValidationData,
  getConfirmedSuggestions,
  getPhoneDataForPhoneType,
  getSuggestedAddresses,
  getValidationKey,
  showValidationScreen,
} from 'utils/personalInformation'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { omit } from 'underscore'
import { profileAddressType } from 'screens/ProfileScreen/AddressSummary'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analytics'
import getEnv from 'utils/env'

const { ENVIRONMENT } = getEnv()

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

export const dispatchClearAuthorizedServices = (): ReduxAction => {
  return {
    type: 'AUTHORIZED_SERVICES_CLEAR',
    payload: {},
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
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getProfileInfo(screenID))))

    try {
      dispatch(dispatchStartGetProfileInfo())
      const user = await api.get<api.UserData>('/v0/user')

      // TODO: delete in story #19175
      const userEmail = user?.data.attributes.profile.signinEmail
      if (userEmail === 'vets.gov.user+1401@gmail.com') {
        throw { status: 408 }
      } else if (userEmail === 'vets.gov.user+1414@gmail.com') {
        // TODO mock user to have SM for story #25035
        user?.data.attributes.authorizedServices.push(VAServicesConstants.SecureMessaging)
      }

      dispatch(dispatchFinishGetProfileInfo(user?.data.attributes.profile))
      dispatch(dispatchUpdateAuthorizedServices(user?.data.attributes.authorizedServices))
      dispatch(dispatchUpdateHealth(user?.data.attributes.health))
      await setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetProfileInfo(undefined, error))
        dispatch(dispatchUpdateAuthorizedServices(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
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
    dispatch(dispatchClearErrors(screenID))
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

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_phone(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSavePhoneNumber())
    } catch (err) {
      if (isErrorObject(err)) {
        console.error(err)
        dispatch(dispatchFinishSavePhoneNumber(err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}

export const deleteUsersNumber = (phoneType: PhoneType, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(deleteUsersNumber(phoneType, screenID))))

    try {
      dispatch(dispatchStartSavePhoneNumber())

      const profile = getState().personalInformation.profile

      if (!profile) {
        console.error('Attempting to delete phone number from a user with no profile.')
        return
      }

      const existingPhoneData = getPhoneDataForPhoneType(phoneType, profile)

      if (!existingPhoneData) {
        console.error(`Attempting to delete phone number from a user with no existing phone data for type ${phoneType}.`)
        return
      }

      let deletePhoneData: PhoneData = {
        id: existingPhoneData.id,
        areaCode: existingPhoneData.areaCode,
        countryCode: '1',
        phoneNumber: existingPhoneData.phoneNumber,
        phoneType: phoneType,
      }

      // Add extension only if it exist
      if (existingPhoneData.extension) {
        deletePhoneData = {
          ...deletePhoneData,
          extension: existingPhoneData.extension,
        }
      }

      await api.del<api.EditResponseData>('/v0/user/phones', (deletePhoneData as unknown) as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_phone(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSavePhoneNumber())
    } catch (err) {
      if (isErrorObject(err)) {
        console.error(err)
        dispatch(dispatchFinishSavePhoneNumber(err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
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
      dispatch(dispatchClearErrors(screenID))
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

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_email(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveEmail())
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveEmail(err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}

/**
 * Redux action to make the API call to delete a users email
 */
export const deleteEmail = (email: string, emailId: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchClearErrors(screenID))
      dispatch(dispatchSetTryAgainFunction(() => dispatch(deleteEmail(email, emailId, screenID))))
      dispatch(dispatchStartSaveEmail())

      const emailDeleteData = {
        id: emailId,
        emailAddress: email,
      }

      await api.del<api.EditResponseData>('/v0/user/emails', (emailDeleteData as unknown) as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(_getState())
      await logAnalyticsEvent(Events.vama_prof_update_email(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveEmail())
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveEmail(err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
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
    dispatch(dispatchClearErrors(screenID))
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

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_address(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveAddress())
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveAddress(err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}

/**
 * Remove a users address
 */
export const deleteAddress = (addressData: AddressData, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(deleteAddress(addressData, screenID))))

    try {
      dispatch(dispatchStartSaveAddress())

      await api.del<api.EditResponseData>('/v0/user/addresses', (addressData as unknown) as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(_getState())
      await logAnalyticsEvent(Events.vama_prof_update_address(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveAddress())
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveAddress(err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
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
  confirmedSuggestedAddresses?: Array<SuggestedAddress>,
  addressData?: AddressData,
  addressValidationScenario?: AddressValidationScenarioTypes,
  validationKey?: number,
): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS',
    payload: {
      suggestedAddresses,
      confirmedSuggestedAddresses,
      addressData,
      addressValidationScenario,
      validationKey,
    },
  }
}

/**
 * Redux action to make the API call to validate a users address
 */
export const validateAddress = (addressData: AddressData, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(validateAddress(addressData, screenID))))

    try {
      dispatch(dispatchStartValidateAddress())
      const validationResponse = await api.post<api.AddressValidationData>('/v0/user/addresses/validate', (addressData as unknown) as api.Params)
      const suggestedAddresses = getSuggestedAddresses(validationResponse)
      const confirmedSuggestedAddresses = getConfirmedSuggestions(suggestedAddresses)
      const validationKey = getValidationKey(suggestedAddresses)

      if (suggestedAddresses && confirmedSuggestedAddresses && showValidationScreen(addressData, suggestedAddresses)) {
        const addressValidationScenario = getAddressValidationScenarioFromAddressValidationData(suggestedAddresses, confirmedSuggestedAddresses, validationKey)
        dispatch(dispatchFinishValidateAddress(suggestedAddresses, confirmedSuggestedAddresses, addressData, addressValidationScenario, validationKey))
      } else {
        dispatch(dispatchFinishValidateAddress())
        // if no validation screen is needed, this means we can use the first and only suggested address to update with
        if (suggestedAddresses) {
          const address = getAddressDataFromSuggestedAddress(suggestedAddresses[0], addressData.id)
          addressData.addressMetaData = validationResponse?.data[0]?.meta?.address
          await dispatch(updateAddress(address, screenID))
        }
      }
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishValidateAddress())
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}

export const finishValidateAddress = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchFinishValidateAddress())
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
