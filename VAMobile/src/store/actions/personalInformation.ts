import * as api from 'store/api'
import { AsyncReduxAction, PersonalInformationFinishEditPhoneNumAction, PersonalInformationStartEditPhoneNumAction } from 'store/types'
import { PhoneType } from 'store/api/types'

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

const dispatchStartEditPhoneNumber = (): PersonalInformationStartEditPhoneNumAction => {
  return {
    type: 'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER',
    payload: {},
  }
}

const dispatchFinishEditPhoneNumber = (error?: Error): PersonalInformationFinishEditPhoneNumAction => {
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

      const formattedNumber = `(${phoneNumber.substring(0, 3)})-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`

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

export const getProfileInfo = async (): Promise<api.UserDataProfile | undefined> => {
  console.debug('getProfileInfo: testing user data')
  // const user = await api.get<api.UserData>('/v0/user')

  // console.debug('getProfileInfo: ', user)
  // return user?.data.attributes.profile

  // TODO this is a workaround to avoid 500 responses from the profile service until it is available
  return user
}
