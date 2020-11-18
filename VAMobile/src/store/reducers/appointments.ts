import _, { Collection } from 'underscore'

import { format } from 'date-fns'

import { AppointmentsGroupedByMonth, AppointmentsGroupedByYear } from 'store/api'
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
      // console.log('WA:AIII')
      // appointmentsByMonth = _.groupBy(appointmentsList, (appointment): string => {
      //   const startTime = new Date(appointment.attributes.startTime)
      //   return format(new Date(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate()), 'yyyy')
      // })

      // console.log('UPDATED IS ', appointmentsByYear)
      //
      // const updated = _.map(appointmentsByYear, (listOfAppointments: Collection<any>, year) => {
      //   return _.groupBy(listOfAppointments, (appointment): string => {
      //     const startTime = new Date(appointment.attributes.startTime)
      //     return format(new Date(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate()), 'MMMM')
      //   })
      // })

      appointmentsByMonth = _.groupBy(appointmentsList, (appointment): string => {
        const startTime = new Date(appointment.attributes.startTime)
        return format(new Date(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate()), 'MMMM')
      })
    }

    console.log('HERE I AM ', appointmentsByMonth)

    return {
      ...state,
      appointmentsByMonth,
      error,
      loading: false,
    }
  },
})
