import AsyncStorage from '@react-native-async-storage/async-storage'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { LoadPushPreferencesData, PushPreference } from 'api/types'
import { put } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { notificationKeys } from './queryKeys'
import { DEVICE_ENDPOINT_SID } from './registerDevice'

/**
 * Updates a user's push preference
 */
const updatePushPreferences = async (preference: PushPreference) => {
  const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
  const params = { preference: preference.preferenceId, enabled: !preference.value }
  return put(`/v0/push/prefs/${endpoint_sid}`, params)
}

/**
 * Returns a mutation for updating users push preference
 */
export const useUpdatePushPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePushPreferences,
    onSuccess: (data: unknown, preference: PushPreference) => {
      const pushPreferences = queryClient.getQueryData(notificationKeys.pushPreferences) as LoadPushPreferencesData
      const index = pushPreferences.preferences.findIndex((p) => p.preferenceId === preference.preferenceId)
      const newPrefSetting: PushPreference = {
        preferenceId: preference.preferenceId,
        preferenceName: preference.preferenceName,
        value: !preference.value,
      }
      pushPreferences.preferences.splice(index, 1, newPrefSetting)
      queryClient.setQueryData(notificationKeys.pushPreferences, pushPreferences)
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'setPushPref: Service error')
      }
    },
  })
}
