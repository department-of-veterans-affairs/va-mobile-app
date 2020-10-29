import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { PhoneType } from 'store/api'
import { formatPhoneNumber } from 'utils/formattingUtils'

const user: api.UserDataProfile = {
  fax_phone: {
    id: 1,
    areaCode: '555',
    countryCode: '1',
    phoneNumber: '1234567',
    phoneType: 'FAX',
  },
  formatted_fax_phone: '',
  formatted_home_phone: '',
  formatted_mobile_phone: '',
  formatted_work_phone: '',
  home_phone: {
    id: 1,
    areaCode: '555',
    countryCode: '1',
    phoneNumber: '1234568',
    phoneType: 'HOME',
  },
  mailing_address: undefined,
  mobile_phone: {
    id: 1,
    areaCode: '555',
    countryCode: '1',
    phoneNumber: '1234569',
    phoneType: 'MOBILE',
  },
  most_recent_branch: '',
  residential_address: undefined,
  work_phone: {
    id: 1,
    areaCode: '555',
    countryCode: '1',
    phoneNumber: '1234560',
    phoneType: 'WORK',
  },
  first_name: 'Test',
  middle_name: '',
  last_name: 'LastN',
  full_name: 'Test LastN',
  email: 'user123@id.me',
  birth_date: '04/01/1970',
  gender: 'M',
  addresses: '1234 Test Ln',
}

const dispatchStartGetProfileInfo = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_GET_INFO',
    payload: {},
  }
}

const dispatchFinishGetProfileInfo = (profile?: api.UserDataProfile, error?: Error): ReduxAction => {
  // TODO: remove this assignment once profile service passes along this data
  if (profile) {
    profile.most_recent_branch = 'United States Air Force'
  }

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

      // const user = await api.get<api.UserData>('/v0/user')
      // return user?.data.attributes.profile

      // TODO this is a workaround to avoid 500 responses from the profile service until it is available
      dispatch(dispatchFinishGetProfileInfo(user))
    } catch (error) {
      dispatch(dispatchFinishGetProfileInfo(undefined, error))
    }
  }
}

const dispatchStartEditPhoneNumber = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER',
    payload: {},
  }
}

const dispatchFinishEditPhoneNumber = (error?: Error): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER',
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
 * @param callApiPut - boolean to determine if api call should be made (remove param when backend ready)
 *
 * @returns AsyncReduxAction
 */
export const editUsersNumber = (phoneType: PhoneType, phoneNumber: string, extension: string, numberId: number, callApiPut?: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartEditPhoneNumber())

      const updatedPhoneData = {
        id: numberId,
        areaCode: phoneNumber.substring(0, 3),
        countryCode: '1',
        phoneNumber: phoneNumber.substring(3),
        phoneType: phoneType,
      }

      const formattedNumber = formatPhoneNumber(phoneNumber)

      // TODO remove if once backend endpoint is ready (need to consider extension too)
      if (callApiPut) {
        await api.put<api.UserData>('/v0/user/phones', (updatedPhoneData as unknown) as api.Params)
      } else {
        switch (phoneType) {
          case 'HOME':
            user.home_phone = updatedPhoneData
            user.formatted_home_phone = formattedNumber
            break
          case 'WORK':
            user.work_phone = updatedPhoneData
            user.formatted_work_phone = formattedNumber
            break
          case 'MOBILE':
            user.mobile_phone = updatedPhoneData
            user.formatted_mobile_phone = formattedNumber
            break
          case 'FAX':
            user.fax_phone = updatedPhoneData
            user.formatted_fax_phone = formattedNumber
            break
        }
      }

      dispatch(dispatchFinishEditPhoneNumber())
    } catch (err) {
      dispatch(dispatchFinishEditPhoneNumber(err))
    }
  }
}

const dispatchStartSaveEmail = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL',
    payload: {},
  }
}

const dispatchFinishEditEmail = (error?: Error): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_FINISH_EDIT_EMAIL',
    payload: { error },
  }
}

const dispatchStartEditEmail = (): ReduxAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_EDIT_EMAIL',
    payload: {},
  }
}

/**
 * Redux action to make the API call to update a users email
 */
export const updateEmail = (email?: string): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    try {
      dispatch(dispatchStartSaveEmail())

      // TODO: enable this when it the API is available
      // const emailUpdateData = {
      //   id: 0,
      //   email: email,
      // }
      // await api.put<api.UserData>('/v0/user/emails', (emailUpdateData as unknown) as api.Params)

      // TODO temporary to show the change before saving is available
      user.email = email || ''

      dispatch(dispatchFinishEditEmail())
    } catch (err) {
      dispatch(dispatchFinishEditEmail(err))
    }
  }
}

/**
 * Redux action for entering the email edit mode
 */
export const startEditEmail = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchStartEditEmail())
  }
}
