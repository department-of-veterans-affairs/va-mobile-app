import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigationState } from '@react-navigation/native'

import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { each } from 'underscore'

import { maintenanceWindowsKeys } from 'api/maintenanceWindows/queryKeys'
import store, { RootState } from 'store'
import { DowntimeFeatureType, MaintenanceWindowsGetData, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { AuthState, DowntimeWindowsByFeatureType } from 'store/slices'

export type MaintenanceWindowOverrideStorage = Record<string, { startTime: string; endTime: string } | undefined>
export const MAINTENANCE_WINDOW_OVERRIDES = '@maintenance_window_overrides'
const MAINTENANCE_WINDOW_REFETCH_INTERVAL = 180000 // 3 minutes

/**
 * Fetch maintenance windows
 */
const getMaintenanceWindows = async (): Promise<DowntimeWindowsByFeatureType> => {
  const { demoMode } = store.getState().demo

  if (demoMode) {
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
    staleTime: MAINTENANCE_WINDOW_REFETCH_INTERVAL,
  })
}

/**
 * returns the maintenance windows. Only passes the maintenance windows to the component from initial render to prevent new
 * maintenance window changes affecting the currently focused screen.
 */
export const useMaintenanceWindows = () => {
  const { data, isFetched } = useMaintenanceWindowQuery()
  const [maintenanceWindows, setMaintenanceWindows] = useState<DowntimeWindowsByFeatureType | undefined>(data)
  const routeName = useNavigationState((state) => state?.routes[state.index]?.name)
  const [prevRoute, setPrevRoute] = useState<string>('')

  // Update local state when data loads for the first time
  useEffect(() => {
    if (data && maintenanceWindows === undefined) {
      setMaintenanceWindows(data)
    }
  }, [data, maintenanceWindows])

  // Only updates maintenance window when the screen changes
  useEffect(() => {
    if (prevRoute !== routeName) {
      setPrevRoute(routeName)
      if (data) {
        setMaintenanceWindows(data)
      }
    }
  }, [data, prevRoute, routeName])

  return { maintenanceWindows, isFetched }
}
