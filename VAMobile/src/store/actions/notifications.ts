import { AsyncReduxAction, ReduxAction } from '../types'
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
    if (deviceToken) {
      const savedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY)
      // if there is no saved token, we have not registered
      // if there is a token and it is different, we need to register the change with VETEXT
      if (!savedToken || savedToken !== deviceToken) {
        //TODO: here we call the register api for VETEXT
        await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken)
      }
    } else {
      await AsyncStorage.removeItem(DEVICE_TOKEN_KEY)
    }
    dispatch(updateDeviceToken(deviceToken))
  }
}
