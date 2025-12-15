import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { each, reduce } from 'underscore'

import { maintenanceWindowsKeys } from 'api/maintenanceWindows/queryKeys'
import { RootState } from 'store'
import { DowntimeFeatureType, MaintenanceWindowsGetData, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { AuthState, DowntimeWindowsByFeatureType } from 'store/slices'

export type MaintenanceWindowOverrideStorage = Record<string, { startTime: string; endTime: string } | undefined>
export const MAINTENANCE_WINDOW_OVERRIDES = '@maintenance_window_overrides'
const MAINTENANCE_WINDOW_REFETCH_INTERVAL = 180000 // 3 minutes

const initializeDowntimeWindowsByFeature = (): DowntimeWindowsByFeatureType => {
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
const getMaintenanceWindows = async (): Promise<DowntimeWindowsByFeatureType> => {
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
const useMaintenanceWindowQuery = () => {
  const { loggedIn } = useSelector<RootState, AuthState>((state) => state.auth)

  return useQuery({
    enabled: loggedIn,
    queryKey: maintenanceWindowsKeys.maintenanceWindows,
    queryFn: getMaintenanceWindows,
    meta: {
      errorName: 'getMaintenanceWindows: Service error',
    },
    refetchInterval: MAINTENANCE_WINDOW_REFETCH_INTERVAL,
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
    }, [data]),
  )

  return { maintenanceWindows, isFetched }
}
