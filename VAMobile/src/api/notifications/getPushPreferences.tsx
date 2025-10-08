import AsyncStorage from '@react-native-async-storage/async-storage'

import { useQuery } from '@tanstack/react-query'

import { GetPushPrefsResponse, LoadPushPreferencesData } from 'api/types'
import store from 'store'
import { get } from 'store/api'

import { notificationKeys } from './queryKeys'
import { DEVICE_ENDPOINT_SID } from './registerDevice'

/**
 * Fetch user push preferences
 */
const getPushPreferences = async (): Promise<LoadPushPreferencesData | undefined> => {
  const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
  const demoMode = store.getState().demo.demoMode
  let response
  if (endpoint_sid) {
    response = await get<GetPushPrefsResponse>(`/v0/push/prefs/${endpoint_sid}`)
  } else if (demoMode) {
    response = await get<GetPushPrefsResponse>(`/v0/push/prefs/`)
  }
  return {
    preferences: response?.data.attributes.preferences || [],
  }
}

/**
 * Returns a query for user push preferences
 */
export const usePushPreferences = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: notificationKeys.pushPreferences,
    queryFn: () => getPushPreferences(),
    meta: {
      errorName: 'getPushPreferences: Service error',
    },
  })
}
