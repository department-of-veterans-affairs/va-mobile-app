import { DateTime, Interval } from 'luxon'

import { AppointmentData, AppointmentsGetData } from 'api/types'
import { Params } from 'store/api/api'
import { DemoStore } from 'store/api/demo/store'

/**
 * Type denoting the demo data store
 */
export type AppointmentsDemoStore = {
  '/v0/appointments': {
    past: AppointmentsGetData
    upcoming: AppointmentsGetData
  }
}

/**
 * Type to define the mock returns to keep type safety
 */
export type AppointmentDemoReturnTypes = undefined | AppointmentsGetData

/**
 * Function used to get user appointments
 * @param params- PUT/POST params that will be used to update the demo store.
 */
export const getAppointments = (store: DemoStore, params: Params): AppointmentsGetData | undefined => {
  const endDate = params.endDate
  const startDate = params.startDate as string
  const sortDirection = params.sort

  if (endDate && typeof endDate === 'string' && sortDirection && typeof sortDirection === 'string') {
    // Changed from prior check because now past 3 months goes until current end of day
    if (sortDirection.startsWith('-')) {
      // Filter data from json file with dates in specified time range
      const pastAppts = JSON.parse(JSON.stringify(store['/v0/appointments'].past))
      const interval = Interval.fromDateTimes(new Date(startDate), new Date(endDate))
      const filteredApptsData = pastAppts.data.filter((appt: AppointmentData) => {
        const apptDate = DateTime.fromISO(appt.attributes.startDateLocal)
        return interval.contains(apptDate)
      })
      pastAppts.data = [...filteredApptsData]
      pastAppts.meta.pagination.totalEntries = filteredApptsData.length
      return pastAppts
    } else {
      return store['/v0/appointments'].upcoming
    }
  } else {
    return undefined
  }
}
