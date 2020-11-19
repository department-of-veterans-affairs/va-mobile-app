import _ from 'underscore'

import { format } from 'date-fns'

import { AppointmentsGroupedByMonth } from 'store/api'
import createReducer from './createReducer'

export type AppointmentsState = {
  loading: boolean
  error?: Error
  appointmentsByMonth?: AppointmentsGroupedByMonth
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  appointmentsByMonth: {} as AppointmentsGroupedByMonth,
}

export default createReducer<AppointmentsState>(initialAppointmentsState, {
  APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: (state, { appointmentsList, error }) => {
    let appointmentsByMonth: AppointmentsGroupedByMonth = {}
    if (appointmentsList) {
      appointmentsByMonth = _.groupBy(appointmentsList, (appointment): string => {
        const startTime = new Date(appointment.attributes.startTime)
        return format(new Date(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate()), 'MMMM')
      })
    }

    return {
      ...state,
      appointmentsByMonth,
      error,
      loading: false,
    }
  },
})
