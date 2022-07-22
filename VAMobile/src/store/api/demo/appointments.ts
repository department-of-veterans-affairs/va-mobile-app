import { AppointmentGetMessagesData, AppointmentsGetData } from '../types'
import { DemoStore } from './store'
import { Params } from '../api'

import { DateTime } from 'luxon'

/**
 * Type denoting the demo data store
 */
export type AppointmentsDemoStore = {
  '/v0/appointments': {
    past: AppointmentsGetData
    upcoming: AppointmentsGetData
  }

  // pending appointments in past
  '/v0/appointment_requests/8a48912a6d02b0fc016d20b4ccb9001b/messages': AppointmentGetMessagesData
  '/v0/appointment_requests/8a48e8db6d70a38a016d72b354240003/messages': AppointmentGetMessagesData
  '/v0/appointment_requests/6a48912a6d02b0fc016d20b4ccb9001d/messages': AppointmentGetMessagesData
  // pending appointments in upcoming
  '/v0/appointment_requests/9a48912a6d02b0fc016d20b4ccb9001a/messages': AppointmentGetMessagesData
  '/v0/appointment_requests/9a48e8db6d70a38a016d72b354240002/messages': AppointmentGetMessagesData
  '/v0/appointment_requests/7a48912a6d02b0fc016d20b4ccb9001a/messages': AppointmentGetMessagesData
  '/v0/appointment_requests/6a48912a6d02b0fc016d20b4ccb9001a/messages': AppointmentGetMessagesData
  '/v0/appointment_requests/6a48912a6d02b0fc016d20b4ccb9001z/messages': AppointmentGetMessagesData
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
