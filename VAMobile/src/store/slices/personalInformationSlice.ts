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
  VAServicesConstants,
  addressPouTypes,
  get,
} from '../api'
import { AppThunk } from 'store'
import { Events, UserAnalytics } from 'constants/analytics'
import { MockUsersEmail } from 'constants/common'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { dispatchUpdateAuthorizedServices } from './authorizedServicesSlice'
import {
  getAddressDataFromSuggestedAddress,
  getAddressValidationScenarioFromAddressValidationData,
  getConfirmedSuggestions,
  getPhoneDataForPhoneType,
  getSuggestedAddresses,
  getValidationKey,
  showValidationScreen,
} from 'utils/personalInformation'
import { getAllFieldsThatExist, getFormattedPhoneNumber, isErrorObject, sanitizeString } from 'utils/common'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { profileAddressType } from 'screens/ProfileScreen/AddressSummary'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'
import getEnv from 'utils/env'

const { ENVIRONMENT } = getEnv()

export type PersonalInformationState = {
  loading: boolean
  emailSaved: boolean
  phoneNumberSaved: boolean
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
}

export const initialPersonalInformationState: PersonalInformationState = {
  loading: false,
  needsDataLoad: true,
  emailSaved: false,
  addressSaved: false,
  showValidation: false,
  preloadComplete: false,
  phoneNumberSaved: false,
}

const PhoneTypeToFormattedNumber: {
  [key in PhoneType]: ProfileFormattedFieldType
} = {
  HOME: 'formattedHomePhone',
  MOBILE: 'formattedMobilePhone',
  WORK: 'formattedWorkPhone',
  FAX: 'formattedFaxPhone',
}

const AddressPouToProfileAddressFieldType: {
  [key in addressPouTypes]: profileAddressType
} = {
  ['RESIDENCE/CHOICE']: 'residentialAddress',
  CORRESPONDENCE: 'mailingAddress',
}

export const getProfileInfo =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getProfileInfo(screenID))))

    try {
      dispatch(dispatchStartGetProfileInfo())
      const user = await get<UserData>('/v0/user')

      // TODO: delete in story #19175
      const userEmail = user?.data.attributes.profile.signinEmail
      if (userEmail === MockUsersEmail.user_1401) {
        throw { status: 408 }
      } else if (userEmail === MockUsersEmail.user_1414) {
        // TODO mock user to have SM for story #25035
        user?.data.attributes.authorizedServices.push(VAServicesConstants.SecureMessaging)
      }

      const profile = user?.data.attributes.profile
      const authorizedServices = user?.data.attributes.authorizedServices
      dispatch(dispatchFinishGetProfileInfo({ profile }))
      dispatch(dispatchUpdateAuthorizedServices({ authorizedServices }))
      // dispatch(dispatchUpdateCerner(user?.data.attributes.health))
      await setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetProfileInfo({ error }))
        dispatch(dispatchUpdateAuthorizedServices({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const editUsersNumber =
  (phoneType: PhoneType, phoneNumber: string, extension: string, numberId: number, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
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
    } catch (err) {
      if (isErrorObject(err)) {
        console.error(err)
        dispatch(dispatchFinishSavePhoneNumber(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const deleteUsersNumber =
  (phoneType: PhoneType, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
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

      await api.del<api.EditResponseData>('/v0/user/phones', deletePhoneData as unknown as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_phone(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSavePhoneNumber())
    } catch (err) {
      if (isErrorObject(err)) {
        console.error(err)
        dispatch(dispatchFinishSavePhoneNumber(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const finishEditPhoneNumber = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishEditPhoneNumber())
}

export const updateEmail =
  (email?: string, emailId?: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(dispatchClearErrors(screenID))
      dispatch(dispatchSetTryAgainFunction(() => dispatch(updateEmail(email, emailId, screenID))))
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
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveEmail(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const deleteEmail =
  (email?: string, emailId?: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(dispatchClearErrors(screenID))
      dispatch(dispatchSetTryAgainFunction(() => dispatch(deleteEmail(email, emailId, screenID))))
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
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveEmail(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const finishEditEmail = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishEditEmail())
}

export const updateAddress =
  (addressData: AddressData, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
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
        await api.post<api.EditResponseData>('/v0/user/addresses', postAddressDataPayload as unknown as api.Params)
      } else {
        await api.put<api.EditResponseData>('/v0/user/addresses', addressData as unknown as api.Params)
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
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const deleteAddress =
  (addressData: AddressData, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(deleteAddress(addressData, screenID))))

    try {
      dispatch(dispatchStartSaveAddress())

      await api.del<api.EditResponseData>('/v0/user/addresses', addressData as unknown as api.Params)
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_address(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveAddress())
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishSaveAddress(err))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const validateAddress =
  (addressData: AddressData, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(validateAddress(addressData, screenID))))

    try {
      dispatch(dispatchStartValidateAddress())
      const validationResponse = await api.post<api.AddressValidationData>('/v0/user/addresses/validate', addressData as unknown as api.Params)
      const suggestedAddresses = getSuggestedAddresses(validationResponse)
      const confirmedSuggestedAddresses = getConfirmedSuggestions(suggestedAddresses)
      const validationKey = getValidationKey(suggestedAddresses)

      if (suggestedAddresses && confirmedSuggestedAddresses && showValidationScreen(addressData, suggestedAddresses)) {
        const addressValidationScenario = getAddressValidationScenarioFromAddressValidationData(suggestedAddresses, confirmedSuggestedAddresses, validationKey)
        dispatch(dispatchFinishValidateAddress({ suggestedAddresses, confirmedSuggestedAddresses, addressData, addressValidationScenario, validationKey }))
      } else {
        dispatch(dispatchFinishValidateAddress(undefined))
        // if no validation screen is needed, this means we can use the first and only suggested address to update with
        if (suggestedAddresses) {
          const address = getAddressDataFromSuggestedAddress(suggestedAddresses[0], addressData.id)
          addressData.addressMetaData = validationResponse?.data[0]?.meta?.address
          await dispatch(updateAddress(address, screenID))
        }
      }
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishValidateAddress(undefined))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(err), screenID }))
      }
    }
  }

export const finishValidateAddress = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishValidateAddress(undefined))
}

export const finishEditAddress = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFinishEditAddress())
}

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
        profile.formattedFaxPhone = getFormattedPhoneNumber(profile.faxNumber)
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

      state.loading = false
      state.needsDataLoad = emailSaved
      state.emailSaved = emailSaved
    },
    dispatchFinishEditEmail: (state) => {
      state.loading = true
      state.emailSaved = false
    },

    dispatchStartSaveAddress: (state) => {
      state.loading = true
    },
    dispatchFinishSaveAddress: (state, action: PayloadAction<Error | undefined>) => {
      const error = action.payload
      state.error = error
      state.loading = false
      state.needsDataLoad = !error
      state.addressSaved = !error
      state.showValidation = false
    },
    dispatchFinishEditAddress: (state) => {
      state.addressSaved = false
    },
    dispatchStartValidateAddress: (state) => {
      state.loading = true
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
      state.loading = false
      state.addressData = addressData
      state.suggestedAddresses = suggestedAddresses
      state.confirmedSuggestedAddresses = confirmedSuggestedAddresses
      state.addressValidationScenario = addressValidationScenario
      state.validationKey = validationKey
      state.showValidation = !!addressData
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
