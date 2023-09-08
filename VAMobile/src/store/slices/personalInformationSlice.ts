import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { omit } from 'underscore'

import * as api from 'store/api'
import {
  AddressData,
  AddressValidationScenarioTypes,
  PhoneData,
  PhoneType,
  ProfileFormattedFieldType,
  ScreenIDTypes,
  SuggestedAddress,
  UserData,
  UserDataProfile,
  addressPouTypes,
  get,
} from '../api'
import { AppThunk } from 'store'
import { Events, UserAnalytics } from 'constants/analytics'
import { SnackbarMessages } from 'components/SnackBar'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { dispatchUpdateAuthorizedServices } from './authorizedServicesSlice'
import { dispatchUpdateCerner } from './patientSlice'
import {
  getAddressDataFromSuggestedAddress,
  getAddressValidationScenarioFromAddressValidationData,
  getConfirmedSuggestions,
  getPhoneDataForPhoneType,
  getSuggestedAddresses,
  getValidationKey,
  showValidationScreen,
} from 'utils/personalInformation'
import { getAllFieldsThatExist, getFormattedPhoneNumber, isErrorObject, sanitizeString, showSnackBar } from 'utils/common'
import { getAnalyticsTimers, logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { profileAddressType } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'
import getEnv from 'utils/env'

const { ENVIRONMENT } = getEnv()

export type PersonalInformationState = {
  loading: boolean
  emailSaved: boolean
  phoneNumberSaved: boolean
  savingAddress: boolean
  addressSaved: boolean
  profile?: UserDataProfile
  error?: Error
  needsDataLoad: boolean
  addressData?: AddressData
  suggestedAddresses?: Array<SuggestedAddress>
  confirmedSuggestedAddresses?: Array<SuggestedAddress>
  addressValidationScenario?: AddressValidationScenarioTypes
  validationKey?: number
  showValidation: boolean
  preloadComplete: boolean
  validateAddressAbortController?: AbortController
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
  needsDataLoad: true,
  emailSaved: false,
  savingAddress: false,
  addressSaved: false,
  showValidation: false,
  preloadComplete: false,
  phoneNumberSaved: false,
  validateAddressAbortController: undefined,
}

const personalInformationNonFatalErrorString = 'Personal Information Service Error'

const PhoneTypeToFormattedNumber: {
  [key in PhoneType]: ProfileFormattedFieldType
} = {
  HOME: 'formattedHomePhone',
  MOBILE: 'formattedMobilePhone',
  WORK: 'formattedWorkPhone',
}

const AddressPouToProfileAddressFieldType: {
  [key in addressPouTypes]: profileAddressType
} = {
  ['RESIDENCE/CHOICE']: 'residentialAddress',
  CORRESPONDENCE: 'mailingAddress',
}

/**
 * Redux action to get user profile
 */
export const getProfileInfo =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getProfileInfo(screenID))))

    try {
      dispatch(dispatchStartGetProfileInfo())
      const user = await get<UserData>('/v1/user')
      const profile = user?.data.attributes.profile
      const authorizedServices = user?.data.attributes.authorizedServices
      dispatch(dispatchFinishGetProfileInfo({ profile }))
      dispatch(dispatchUpdateAuthorizedServices({ authorizedServices }))
      dispatch(dispatchUpdateCerner({ cerner: user?.data.attributes.health }))
      await setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getProfileInfo: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishGetProfileInfo({ error }))
        dispatch(dispatchUpdateAuthorizedServices({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to update the users phone number
 *
 * @param phoneType - string specifying the type of number being updated (can be HOME, WORK, MOBILE)
 * @param phoneNumber - string of numbers signifying area code and phone number
 * @param extension - string of numbers signifying extension number
 * @param numberId - number indicating the id of the phone number
 * @param messages - messages to show in success and error snackbars
 * @param screenID - ID used to compare within the component to see if an error component needs to be rendered
 */
export const editUsersNumber =
  (phoneType: PhoneType, phoneNumber: string, extension: string, numberId: number, messages: SnackbarMessages, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))

    const retryFunction = () => dispatch(editUsersNumber(phoneType, phoneNumber, extension, numberId, messages, screenID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))

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
        await api.post<api.EditResponseData>('/v0/user/phones', updatedPhoneData as unknown as api.Params)
      } else {
        const updatedPutPhoneData = {
          ...updatedPhoneData,
          id: numberId,
        }
        await api.put<api.EditResponseData>('/v0/user/phones', updatedPutPhoneData as unknown as api.Params)
      }

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_phone(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSavePhoneNumber())
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `editUsersNumber: ${personalInformationNonFatalErrorString}`)
        console.error(err)
        dispatch(dispatchFinishSavePhoneNumber(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true, true)
      }
    }
  }

/**
 * Redux action for deleting number
 */
export const deleteUsersNumber =
  (phoneType: PhoneType, messages: SnackbarMessages, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))

    const retryFunction = () => dispatch(deleteUsersNumber(phoneType, messages, screenID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))

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

      await api.del<api.EditResponseData>('/v0/user/phones', deletePhoneData as unknown as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_phone(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSavePhoneNumber())
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `deleteUsersNumber: ${personalInformationNonFatalErrorString}`)
        console.error(err)
        dispatch(dispatchFinishSavePhoneNumber(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true, true)
      }
    }
  }

/**
 * Redux action for leaving the phone number edit mode
 */
export const finishEditPhoneNumber = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishEditPhoneNumber())
}

/**
 * Redux action to make the API call to update a users email
 */
export const updateEmail =
  (messages: SnackbarMessages, email?: string, emailId?: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    const retryFunction = () => dispatch(updateEmail(messages, email, emailId, screenID))
    try {
      dispatch(dispatchClearErrors(screenID))
      dispatch(dispatchSetTryAgainFunction(retryFunction))
      dispatch(dispatchStartSaveEmail())

      // if it doesnt exist call post endpoint instead
      const createEntry = !getState().personalInformation.profile?.contactEmail?.emailAddress

      if (createEntry) {
        await api.post<api.EditResponseData>('/v0/user/emails', { emailAddress: email } as unknown as api.Params)
      } else {
        const emailUpdateData = {
          id: emailId,
          emailAddress: email,
        }
        await api.put<api.EditResponseData>('/v0/user/emails', emailUpdateData as unknown as api.Params)
      }

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_email(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveEmail())
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `updateEmail: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishSaveEmail(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
        // The email is not validating for a reason our front end validation does not know about, so it will always fail
        if (err.status === 400) {
          showSnackBar(messages.errorMsg, dispatch, undefined, true, true)
        } else {
          showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
        }
      }
    }
  }

/**
 * Redux action to make the API call to delete a users email
 */
export const deleteEmail =
  (messages: SnackbarMessages, email?: string, emailId?: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    const retryFunction = () => dispatch(deleteEmail(messages, email, emailId, screenID))

    try {
      dispatch(dispatchClearErrors(screenID))
      dispatch(dispatchSetTryAgainFunction(retryFunction))
      dispatch(dispatchStartSaveEmail())

      const emailDeleteData = {
        id: emailId,
        emailAddress: email,
      }

      await api.del<api.EditResponseData>('/v0/user/emails', emailDeleteData as unknown as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_email(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveEmail())
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `deleteEmail: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishSaveEmail(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Redux action for exiting the email edit mode
 */
export const finishEditEmail = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishEditEmail())
}

/**
 * Redux action to make the API call to update a users address
 */
export const updateAddress =
  (addressData: AddressData, messages: SnackbarMessages, screenID?: ScreenIDTypes, revalidate?: boolean): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    const retryFunction = () => dispatch(updateAddress(addressData, messages, screenID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))

    try {
      dispatch(dispatchStartSaveAddress())

      const addressPou = addressData.addressPou
      const addressFieldType = AddressPouToProfileAddressFieldType[addressPou]
      const profile = getState().personalInformation.profile

      // if address doesnt exist call post endpoint instead
      const createEntry = !(profile || {})[addressFieldType as keyof UserDataProfile]

      // to revalidate address when suggested address is selected
      if (revalidate) {
        const validationResponse = await api.post<api.AddressValidationData>('/v0/user/addresses/validate', addressData as unknown as api.Params)
        const validationKey = getValidationKey(getSuggestedAddresses(validationResponse))
        addressData.validationKey = validationKey
      }

      if (createEntry) {
        const postAddressDataPayload = omit(addressData, 'id')
        await api.post<api.EditResponseData>('/v0/user/addresses', postAddressDataPayload as unknown as api.Params)
      } else {
        await api.put<api.EditResponseData>('/v0/user/addresses', addressData as unknown as api.Params)
      }

      dispatch(getProfileInfo(screenID))

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_address(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveAddress())
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `updateAddress: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishSaveAddress(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Remove a users address
 */
export const deleteAddress =
  (addressData: AddressData, messages: SnackbarMessages, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    const retryFunction = () => dispatch(deleteAddress(addressData, messages, screenID))
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))

    try {
      dispatch(dispatchStartSaveAddress())

      await api.del<api.EditResponseData>('/v0/user/addresses', addressData as unknown as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_address(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveAddress())
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `deleteAddress: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishSaveAddress(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Redux action to make the API call to validate a users address
 */
export const validateAddress =
  (addressData: AddressData, messages: SnackbarMessages, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    const retryFunction = () => dispatch(validateAddress(addressData, messages, screenID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))

    // create a new signal for this api call, so it can be aborted if a user leaves(goes back) to the previous screen
    const newAbortController = new AbortController()
    const signal = newAbortController.signal

    try {
      dispatch(dispatchStartValidateAddress({ abortController: newAbortController }))
      const validationResponse = await api.post<api.AddressValidationData>('/v0/user/addresses/validate', addressData as unknown as api.Params, undefined, signal)
      const suggestedAddresses = getSuggestedAddresses(validationResponse)
      const confirmedSuggestedAddresses = getConfirmedSuggestions(suggestedAddresses)
      const validationKey = getValidationKey(suggestedAddresses)

      if (suggestedAddresses && confirmedSuggestedAddresses && showValidationScreen(addressData, suggestedAddresses)) {
        const addressValidationScenario = getAddressValidationScenarioFromAddressValidationData(suggestedAddresses)
        dispatch(dispatchFinishValidateAddress({ suggestedAddresses, confirmedSuggestedAddresses, addressData, addressValidationScenario, validationKey }))
      } else {
        dispatch(dispatchFinishValidateAddress(undefined))
        // if no validation screen is needed, this means we can use the first and only suggested address to update with
        if (suggestedAddresses) {
          const address = getAddressDataFromSuggestedAddress(suggestedAddresses[0], addressData.id)
          addressData.addressMetaData = validationResponse?.data[0]?.meta?.address
          await dispatch(updateAddress(address, messages, screenID))
        }
      }
    } catch (err) {
      if (isErrorObject(err)) {
        logNonFatalErrorToFirebase(err, `validateAddress: ${personalInformationNonFatalErrorString}`)
        dispatch(dispatchFinishValidateAddress(undefined))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

/**
 * Redux action for finishing validating address
 */
export const finishValidateAddress = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishValidateAddress(undefined))
}

/**
 * Redux action for exiting the address edit mode
 */
export const finishEditAddress = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishEditAddress())
}

/**
 * Redux slice that will create the actions and reducers
 */
const peronalInformationSlice = createSlice({
  name: 'personalInformation',
  initialState: initialPersonalInformationState,
  reducers: {
    dispatchStartGetProfileInfo: (state) => {
      state.loading = true
    },

    dispatchFinishGetProfileInfo: (state, action: PayloadAction<{ profile?: UserDataProfile; error?: Error }>) => {
      const { profile, error } = action.payload
      if (profile) {
        profile.firstName = sanitizeString(profile.firstName)
        profile.middleName = sanitizeString(profile.middleName)
        profile.lastName = sanitizeString(profile.lastName)
        profile.fullName = getAllFieldsThatExist([profile.firstName, profile.middleName, profile.lastName]).join(' ').trim()

        profile.formattedHomePhone = getFormattedPhoneNumber(profile.homePhoneNumber)
        profile.formattedMobilePhone = getFormattedPhoneNumber(profile.mobilePhoneNumber)
        profile.formattedWorkPhone = getFormattedPhoneNumber(profile.workPhoneNumber)

        // Reset these since this information is now being pulled from the demographics endpoint.
        // This can be removed when we switch over to the `v2/user` endpoint.
        profile.preferredName = ''
        profile.genderIdentity = ''
      }

      state.profile = profile
      state.error = error
      state.loading = false
      state.needsDataLoad = !!error
      state.preloadComplete = true
    },

    dispatchFinishEditPhoneNumber: (state) => {
      state.loading = true
      state.phoneNumberSaved = false
    },
    dispatchStartSavePhoneNumber: (state) => {
      state.loading = true
    },
    dispatchFinishSavePhoneNumber: (state, action: PayloadAction<Error | undefined>) => {
      const error = action.payload
      state.error = error
      state.loading = false
      state.needsDataLoad = !error
      state.phoneNumberSaved = !error
    },

    dispatchProfileLogout: () => {
      return {
        ...initialPersonalInformationState,
      }
    },
    dispatchStartSaveEmail: (state) => {
      state.loading = true
    },
    dispatchFinishSaveEmail: (state, action: PayloadAction<Error | undefined>) => {
      const emailSaved = !action.payload
      state.error = action.payload
      state.loading = false
      state.needsDataLoad = emailSaved
      state.emailSaved = emailSaved
    },
    dispatchFinishEditEmail: (state) => {
      state.loading = true
      state.emailSaved = false
    },

    dispatchStartSaveAddress: (state) => {
      state.savingAddress = true
    },
    dispatchFinishSaveAddress: (state, action: PayloadAction<Error | undefined>) => {
      const error = action.payload
      state.error = error
      state.savingAddress = false
      state.needsDataLoad = !error
      state.addressSaved = !error
      state.showValidation = false
    },
    dispatchFinishEditAddress: (state) => {
      state.addressSaved = false
    },
    dispatchStartValidateAddress: (state, action: PayloadAction<{ abortController: AbortController }>) => {
      state.savingAddress = true
      state.validateAddressAbortController = action.payload.abortController
    },
    dispatchFinishValidateAddress: (
      state,
      action: PayloadAction<
        | {
            suggestedAddresses?: Array<SuggestedAddress>
            confirmedSuggestedAddresses?: Array<SuggestedAddress>
            addressData?: AddressData
            addressValidationScenario?: AddressValidationScenarioTypes
            validationKey?: number
          }
        | undefined
      >,
    ) => {
      const { addressData, suggestedAddresses, confirmedSuggestedAddresses, addressValidationScenario, validationKey } = action.payload || {}
      state.savingAddress = false
      state.addressData = addressData
      state.suggestedAddresses = suggestedAddresses
      state.confirmedSuggestedAddresses = confirmedSuggestedAddresses
      state.addressValidationScenario = addressValidationScenario
      state.validationKey = validationKey
      state.showValidation = !!addressData
      state.validateAddressAbortController = undefined
    },
  },
})

export const {
  dispatchStartGetProfileInfo,
  dispatchFinishGetProfileInfo,
  dispatchFinishEditPhoneNumber,
  dispatchFinishSavePhoneNumber,
  dispatchProfileLogout,
  dispatchStartSavePhoneNumber,
  dispatchFinishEditEmail,
  dispatchFinishSaveEmail,
  dispatchStartSaveEmail,
  dispatchFinishEditAddress,
  dispatchFinishSaveAddress,
  dispatchStartSaveAddress,
  dispatchFinishValidateAddress,
  dispatchStartValidateAddress,
} = peronalInformationSlice.actions
export default peronalInformationSlice.reducer
