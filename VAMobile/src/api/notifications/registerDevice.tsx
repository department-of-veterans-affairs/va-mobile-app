import AsyncStorage from '@react-native-async-storage/async-storage'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  LoadPushPreferencesData,
  PUSH_APP_NAME,
  PushOsName,
  PushRegistration,
  PushRegistrationResponse,
  RegisterDeviceParams,
} from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { put } from 'store/api'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { getDeviceName } from 'utils/deviceData'
import { isIOS } from 'utils/platform'

import { notificationKeys } from './queryKeys'

export const DEVICE_TOKEN_KEY = '@store_device_token'
export const DEVICE_ENDPOINT_SID = '@store_device_endpoint_sid'
export const USER_ID = '@store_user_id'
/**
 * Updates a user's push preference
 */
const registerDevice = async (
  registerDeviceParams: RegisterDeviceParams,
): Promise<PushRegistrationResponse | undefined> => {
  if (registerDeviceParams.deviceToken) {
    const savedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY)
    const savedSid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
    const savedUserID = await AsyncStorage.getItem(USER_ID)
    const isNewUser = !savedUserID || (registerDeviceParams.userID && savedUserID !== registerDeviceParams.userID)
    const deviceName = await getDeviceName()
    if (!savedToken || savedToken !== registerDeviceParams.deviceToken || !savedSid || isNewUser) {
      const params: PushRegistration = {
        deviceName: deviceName,
        deviceToken: registerDeviceParams.deviceToken,
        appName: PUSH_APP_NAME,
        osName: isIOS() ? PushOsName.ios : PushOsName.android,
        debug: false,
      }
      return put<PushRegistrationResponse>('/v0/push/register', params)
    }
  } else {
    await AsyncStorage.removeItem(DEVICE_TOKEN_KEY)
  }
}

/**
 * Returns a mutation for regestering users device for push notifications
 */
export const useRegisterDevice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: registerDevice,
    onSettled: async (data, error, variables) => {
      const pushPreferences = queryClient.getQueryData(notificationKeys.settings) as LoadPushPreferencesData
      pushPreferences.deviceToken = variables.deviceToken
      queryClient.setQueryData(notificationKeys.settings, pushPreferences)
      setAnalyticsUserProperty(UserAnalytics.vama_uses_notifications(variables.deviceToken ? true : false))
    },
    onSuccess: async (response, variables) => {
      if (response) {
        await AsyncStorage.setItem(DEVICE_ENDPOINT_SID, response?.data.attributes.endpointSid)
        variables.deviceToken && (await AsyncStorage.setItem(DEVICE_TOKEN_KEY, variables.deviceToken))
        variables.userID && (await AsyncStorage.setItem(USER_ID, variables.userID))
      }
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'registerDevice: Service error')
      }
    },
  })
}
