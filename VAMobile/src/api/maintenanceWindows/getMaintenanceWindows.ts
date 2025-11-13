import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { each, reduce } from 'underscore'

import { maintenanceWindowsKeys } from 'api/maintenanceWindows/queryKeys'
import {
  MAINTENANCE_WINDOW_OVERRIDES,
  MaintenanceWindowOverrideStorage,
} from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/OverrideMaintenanceWindows'
import { RootState } from 'store'
import { DowntimeFeatureType, DowntimeFeatureTypeConstants, MaintenanceWindowsGetData, get } from 'store/api'
import { AuthState, DowntimeWindowsByFeatureType } from 'store/slices'

export const initializeDowntimeWindowsByFeature = (): DowntimeWindowsByFeatureType => {
  return reduce(
    DowntimeFeatureTypeConstants,
    (memo: DowntimeWindowsByFeatureType, value: DowntimeFeatureType): DowntimeWindowsByFeatureType => {
      memo[value] = undefined
      return memo
    },
    {} as DowntimeWindowsByFeatureType,
  )
}

/**
 * Fetch maintenance windows
 */
export const getMaintenanceWindows = async (): Promise<DowntimeWindowsByFeatureType> => {
  if (__DEV__) {
    const overrideStr = await AsyncStorage.getItem(MAINTENANCE_WINDOW_OVERRIDES)

    if (overrideStr) {
      const overrides = JSON.parse(overrideStr) as MaintenanceWindowOverrideStorage
      const maintenanceWindows: DowntimeWindowsByFeatureType = {}
      each(overrides, (override, key) => {
        if (override) {
          maintenanceWindows[key as DowntimeFeatureType] = {
            startTime: DateTime.fromISO(override.startTime),
            endTime: DateTime.fromISO(override.endTime),
          }
        } else {
          maintenanceWindows[key as DowntimeFeatureType] = undefined
        }
      })

      console.log(maintenanceWindows)
      return maintenanceWindows
    }
  }

  const response = await get<MaintenanceWindowsGetData>('/v0/maintenance_windows')

  const downtimeWindows =
    response?.data.filter((w) => Object.values(DowntimeFeatureTypeConstants).includes(w.attributes.service)) || []

  const maintenanceWindows: DowntimeWindowsByFeatureType = {}
  for (const window of downtimeWindows) {
    maintenanceWindows[window.attributes.service] = {
      startTime: DateTime.fromISO(window.attributes.startTime),
      endTime: DateTime.fromISO(window.attributes.endTime),
    }
  }

  return maintenanceWindows
}

/**
 * Returns a query for maintenance windows
 */
export const useMaintenanceWindowQuery = () => {
  const { loggedIn } = useSelector<RootState, AuthState>((state) => state.auth)

  return useQuery({
    enabled: loggedIn,
    queryKey: maintenanceWindowsKeys.maintenanceWindows,
    queryFn: getMaintenanceWindows,
    meta: {
      errorName: 'getMaintenanceWindows: Service error',
    },
    refetchInterval: 180000, // 3 minutes
  })
}

export const useMaintenanceWindows = () => {
  const { data, isFetched } = useMaintenanceWindowQuery()
  const [maintenanceWindows, setMaintenanceWindows] = useState<DowntimeWindowsByFeatureType>(
    initializeDowntimeWindowsByFeature(),
  )

  useFocusEffect(
    useCallback(() => {
      if (data) {
        setMaintenanceWindows(data)
      }

      // This should only run on the initial focus
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  )

  return { maintenanceWindows, isFetched }
}
