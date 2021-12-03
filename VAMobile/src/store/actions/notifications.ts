import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { GetPushPrefsResponse, PUSH_APP_NAME, PushOsName, PushPreference } from '../api'
import { deviceName } from 'utils/deviceData'
import { isIOS } from 'utils/platform'
import { notificationsEnabled } from 'utils/notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const DEVICE_TOKEN_KEY = '@store_device_token'
export const DEVICE_ENDPOINT_SID = '@store_device_endpoint_sid'

const dispatchStartRegisterDevice = (): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_START_REGISTER_DEVICE',
    payload: {},
  }
}

const dispatchUpdateDeviceToken = (deviceToken?: string): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_REGISTER_DEVICE',
    payload: {
      deviceToken: deviceToken,
    },
  }
}

const dispatchStartLoadPreferences = (): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_START_GET_PREFS',
    payload: {},
  }
}

const dispatchEndLoadPreferences = (systemNotificationsOn: boolean, preferences?: PushPreference[]): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_GET_PREFS',
    payload: { preferences, systemNotificationsOn },
  }
}

const dispatchStartSetPreference = (): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_START_SET_PREFS',
    payload: {},
  }
}

const dispatchEndSetPreference = (pref?: PushPreference): ReduxAction => {
  return {
    type: 'NOTIFICATIONS_END_SET_PREFS',
    payload: { pref },
  }
}

/**
 * Redux Action for registering a device token with VA Push Notifications
 *
 * Registers the device with the push service, then saves the device token and endpoint SID from Vetext to AsyncStorage
 *
 * @param deviceToken - string generated by Firebase(Android) or NotificationService(iOS) to register device
 */
export const registerDevice = (deviceToken?: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartRegisterDevice())
    try {
      if (deviceToken) {
        const savedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY)
        const savedSid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
        console.debug(`saved endpointSid: ${savedSid}`)
        // if there is no saved token, we have not registered
        // if there is a token and it is different, we need to register the change with VETEXT
        // if the endpoint sid is missing, we need to register again to retrieve it
        if (!savedToken || savedToken !== deviceToken || !savedSid) {
          const params: api.PushRegistration = {
            deviceName,
            deviceToken,
            appName: PUSH_APP_NAME,
            osName: isIOS() ? PushOsName.ios : PushOsName.android,
            debug: false, //TODO debug true is suppose to only work for ios but is currently causing a 502 error(android always set to false)
          }
          const response = await api.put<api.PushRegistrationResponse>('/v0/push/register', params)
          console.debug(`push registration response: ${response}`)
          if (response) {
            await AsyncStorage.setItem(DEVICE_ENDPOINT_SID, response.data.attributes.endpointSid)
            await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken)
          }
        }
      } else {
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY)
      }
    } catch (e) {
      //TODO: log in crashlytics?
      console.error(e)
    }
    dispatch(dispatchUpdateDeviceToken(deviceToken))
  }
}

/**
 * Redux Action to fetch preferences for the device from Vetext.
 */
export const loadPushPreferences = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartLoadPreferences())
    const systemNotificationsOn = await notificationsEnabled()
    try {
      const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
      const response = await api.get<GetPushPrefsResponse>(`/v0/push/prefs/${endpoint_sid}`)
      dispatch(dispatchEndLoadPreferences(systemNotificationsOn, response?.data.attributes.preferences))
    } catch (e) {
      //TODO: log in crashlytics?
      console.error(e)
      dispatch(dispatchEndLoadPreferences(systemNotificationsOn, []))
    }
  }
}

/**
 * Redux Action to set the push preference with Vetext
 *
 * @param preference - push preference object for the preference to by updated
 */
export const setPushPref = (preference: PushPreference): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartSetPreference())
    try {
      const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
      const params = { preference: preference.preferenceId, enabled: !preference.value }
      await api.put(`/v0/push/prefs/${endpoint_sid}`, params)
      const newPrefSetting: api.PushPreference = {
        preferenceId: preference.preferenceId,
        preferenceName: preference.preferenceName,
        value: !preference.value,
      }
      dispatch(dispatchEndSetPreference(newPrefSetting))
    } catch (e) {
      //TODO: log in crashlytics?
      console.error(e)
      dispatch(dispatchEndSetPreference(undefined))
    }
  }
}
