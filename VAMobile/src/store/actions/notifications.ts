import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { GetPushPrefsResponse, PUSH_APP_NAME, Params, PrefApiObject, PushOsName } from '../api'
import { deviceName } from 'utils/deviceData'
import { isIOS } from 'utils/platform'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const DEVICE_TOKEN_KEY = '@store_device_token'
export const DEVICE_ENDPOINT_SID = '@store_device_endpoint_sid'

const startRegisterDevice = (): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_START_REGISTER_DEVICE',
    payload: {},
  }
}

const updateDeviceToken = (deviceToken?: string): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_REGISTER_DEVICE',
    payload: {
      deviceToken: deviceToken,
    },
  }
}

const startLoadPreferences = (): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_START_GET_PREFS',
    payload: {},
  }
}

const endLoadPrefernced = (preferences: { [keyof: string]: boolean }): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_GET_PREFS',
    payload: preferences,
  }
}

const startSetPreference = (): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_START_SET_PREFS',
    payload: {},
  }
}

const endSetPreference = (pref?: PrefApiObject): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_SET_PREFS',
    payload: pref,
  }
}

export const registerDevice = (deviceToken?: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(startRegisterDevice())
    try {
      if (deviceToken) {
        const savedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY)
        // if there is no saved token, we have not registered
        // if there is a token and it is different, we need to register the change with VETEXT
        if (!savedToken || savedToken !== deviceToken) {
          const params: api.PushRegistration = {
            deviceName,
            deviceToken,
            appName: PUSH_APP_NAME,
            osName: isIOS() ? PushOsName.ios : PushOsName.android,
          }
          const response = await api.put<api.PushRegistrationResponse>('/v0/push/register', params)
          if (response) {
            await AsyncStorage.setItem(DEVICE_ENDPOINT_SID, response.attributes.endpointSid)
            await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken)
          }
        }
      } else {
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY)
      }
    } catch (e) {
      //TODO: log in crashlytics?
      console.log(e)
    }
    dispatch(updateDeviceToken(deviceToken))
  }
}

export const loadPushPreferences = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    console.log('HERE I AM')
    dispatch(startLoadPreferences())
    try {
      const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
      const response = await api.get<GetPushPrefsResponse>(`/v0/push/prefs/${endpoint_sid}`)
      console.log(response?.data.attributes.preferences)
      const prefs: { [keyof: string]: boolean } = {}
      response?.data.attributes.preferences.forEach((pref) => (prefs[pref.preference] = pref.enabled))
      dispatch(endLoadPrefernced(prefs))
    } catch (e) {
      //TODO: log in crashlytics?
      console.error(e)
      dispatch(endLoadPrefernced({}))
    }
  }
}

export const setPushPref = (pref: PrefApiObject): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(startSetPreference())
    try {
      const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
      const response = await api.put(`/v0/push/prefs/${endpoint_sid}`, pref)
      console.log(response)
    } catch (e) {
      //TODO: log in crashlytics?
      console.error(e)
      dispatch(endSetPreference(undefined))
    }
  }
}
