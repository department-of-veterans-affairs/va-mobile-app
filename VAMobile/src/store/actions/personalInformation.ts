import * as api from 'store/api'
import { AddressPostData, PhoneType } from 'store/api'
import { AsyncReduxAction, ReduxAction } from '../types'

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

export const getProfileInfo = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartGetProfileInfo())

      const user = await api.get<api.UserData>('/v0/user')
      dispatch(dispatchFinishGetProfileInfo(user?.data.attributes.profile))
    } catch (error) {
      dispatch(dispatchFinishGetProfileInfo(undefined, error))
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

/**
 * Redux action to update the users phone number
 *
 * @param phoneType - string specifying the type of number being updated (can be HOME, WORK, MOBILE, or FAX)
 * @param phoneNumber - string of numbers signifying area code and phone number
 * @param extension - string of numbers signifying extension number
 * @param numberId - number indicating the id of the phone number
 *
 * @returns AsyncReduxAction
 */
export const editUsersNumber = (phoneType: PhoneType, phoneNumber: string, extension: string, numberId: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartSavePhoneNumber())

      // TODO: for new updates, we don't have an ID to pass up. Do we let the user add a new number from this UI?
      const updatedPhoneData = {
        id: numberId,
        areaCode: phoneNumber.substring(0, 3),
        countryCode: '1',
        phoneNumber: phoneNumber.substring(3),
        phoneType: phoneType,
      }

      await api.put<api.UserData>('/v0/user/phones', (updatedPhoneData as unknown) as api.Params)

      dispatch(dispatchFinishSavePhoneNumber())
    } catch (err) {
      console.error(err)
      dispatch(dispatchFinishSavePhoneNumber(err))
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
export const updateEmail = (email?: string, emailId?: string): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    try {
      dispatch(dispatchStartSaveEmail())

      const emailUpdateData = {
        id: emailId,
        emailAddress: email,
      }

      await api.put<api.UserData>('/v0/user/emails', (emailUpdateData as unknown) as api.Params)

      dispatch(dispatchFinishSaveEmail())
    } catch (err) {
      dispatch(dispatchFinishSaveEmail(err))
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

/**
 * Redux action to make the API call to update a users address
 */
export const updateAddress = (addressData: AddressPostData): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    try {
      dispatch(dispatchStartSaveAddress())

      await api.put<api.UserData>('/v0/user/addresses', (addressData as unknown) as api.Params)

      dispatch(dispatchFinishSaveAddress())
    } catch (err) {
      dispatch(dispatchFinishSaveAddress(err))
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
