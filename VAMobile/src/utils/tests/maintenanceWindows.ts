import { DateTime } from 'luxon'
import { each } from 'underscore'

import { DowntimeFeatureType, DowntimeFeatureTypeConstants } from 'store/api'
import { DowntimeWindowsByFeatureType } from 'store/slices'

export const getMaintenanceWindowsPayload = (services: DowntimeFeatureType[]) => {
  const startTime = DateTime.now()
  const endTime = DateTime.now().plus({ minutes: 1 })

  const maintenanceWindows: DowntimeWindowsByFeatureType = {}

  each(DowntimeFeatureTypeConstants, (service) => {
    maintenanceWindows[service] = undefined
  })

  services.forEach((service) => {
    maintenanceWindows[service] = {
      startTime,
      endTime,
    }
  })

  return {
    maintenanceWindows,
  }
}
