import * as api from 'store/api'
import { AsyncReduxAction, PersonalInformationFinishEditPhoneNumAction, PersonalInformationStartEditPhoneNumAction } from 'store/types'
import { PhoneType } from 'store/api/types'

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

export const editUsersNumber = (phoneType: PhoneType, phoneNumber: string, extension: string, callApiPut?: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartEditPhoneNumber())

      // TODO remove if once backend endpoint is ready (need to consider id being passed in & extension too)
      if (callApiPut) {
        await api.put<api.UserData>('/v0/user/phones', {
          id: '',
          areaCode: phoneNumber.substring(0, 3),
          countryCode: '1',
          phoneNumber: phoneNumber.substring(3),
          phoneType: phoneType,
        })
      }

      dispatch(dispatchFinishEditPhoneNumber())
    } catch (err) {
      dispatch(dispatchFinishEditPhoneNumber(err))
    }
  }
}
