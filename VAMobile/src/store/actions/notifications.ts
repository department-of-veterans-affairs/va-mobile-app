import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { PUSH_APP_NAME, PushOsName } from '../api'
import { deviceName } from 'utils/deviceData'
import { isIOS } from '../../utils/platform'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DEVICE_TOKEN_KEY = '@store_device_token'

const updateDeviceToken = (deviceToken?: string): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_REGISTER_DEVICE',
    payload: {
      deviceToken: deviceToken,
    },
  }
}

export const registerDevice = (deviceToken?: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      if (deviceToken) {
        const savedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY)
        // if there is no saved token, we have not registered
        // if there is a token and it is different, we need to register the change with VETEXT
        if (!savedToken || savedToken !== deviceToken) {
          console.log('START REGISTER TOKEN')
          const params: api.PushRegistration = {
            deviceName,
            deviceToken,
            appName: PUSH_APP_NAME,
            osName: isIOS() ? PushOsName.ios : PushOsName.android,
          }
          console.log(params)
          const response = await api.put<api.PushRegistrationResponse>('/v0/push/register', params)
          //TODO: save endpoint sid to AsyncStorage
          console.log('token response')
          //@ts-ignore
          // console.log(response)
          await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken)
        }
      } else {
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY)
      }
    } catch (e) {
      //TODO: log in crashlytics?
      console.log('error')
      // console.log(e)
    }
    dispatch(updateDeviceToken(deviceToken))
  }
}
