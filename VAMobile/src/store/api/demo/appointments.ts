import { DateTime } from 'luxon'

import { AppointmentsGetData } from 'api/types'

import { Params } from '../api'
import { DemoStore } from './store'

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
  //ToDo fix pagination and past appointments to be broken up to the ranges that past appointments can be selected, do this when migrating to msw

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
