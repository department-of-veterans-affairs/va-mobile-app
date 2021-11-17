import { AppointmentsGetData } from '../types'
import { DemoStore } from './store'
import { Params } from '../api'

import { DateTime } from 'luxon'

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
 * Function used to get user appointments. This avoids reuse for the PUT/POST calls required for phones
 * @param params- PUT/POST params that will be used to update the demo store.
 */
export const getAppointments = (store: DemoStore, params: Params): AppointmentsGetData | undefined => {
  const endDate = params.endDate
  if (endDate && typeof endDate === 'string') {
    if (DateTime.fromISO(endDate) < DateTime.now()) {
      return store['/v0/appointments'].past
    } else {
      return store['/v0/appointments'].upcoming
    }
  } else {
    return undefined
  }
}
