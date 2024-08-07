import AsyncStorage from '@react-native-async-storage/async-storage'

import { useQuery } from '@tanstack/react-query'

import queryClient from 'api/queryClient'
import { GetPushPrefsResponse, LoadPushPreferencesData } from 'api/types'
import { get } from 'store/api'

import { notificationKeys } from './queryKeys'
import { DEVICE_ENDPOINT_SID } from './registerDevice'

/**
 * Fetch user push preferences
 */
const loadPushPreferences = async (): Promise<LoadPushPreferencesData | undefined> => {
  const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
  if (!endpoint_sid) return
  const response = await get<GetPushPrefsResponse>(`/v0/push/prefs/${endpoint_sid}`)
  return {
    preferences: response?.data.attributes.preferences || [],
  }
}

/**
 * Returns a query for user push preferences
 */
export const useLoadPushPreferences = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: notificationKeys.settings,
    queryFn: () => loadPushPreferences(),
    meta: {
      errorName: 'loadPushPreferences: Service error',
    },
  })
}
