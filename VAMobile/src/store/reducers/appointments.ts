import _ from 'underscore'

import { AppointmentData, AppointmentsGroupedByYear, AppointmentsList } from 'store/api'
import { getFormattedDate } from 'utils/formattingUtils'
import createReducer from './createReducer'

export type AppointmentsState = {
  loading: boolean
  error?: Error
  appointment?: AppointmentData
  appointmentsList?: AppointmentsList
  appointmentsByYear?: AppointmentsGroupedByYear
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  appointment: {} as AppointmentData,
  appointmentsByYear: {} as AppointmentsGroupedByYear,
  appointmentsList: [] as AppointmentsList,
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
    let initialAppointmentsByYear: { [key: string]: AppointmentsList } = {}
    const appointmentsByYear: AppointmentsGroupedByYear = {}
    if (appointmentsList) {
      // Group appointments by year, resulting object is { year: [ list of appointments for year ] }
      initialAppointmentsByYear = _.groupBy(appointmentsList, (appointment) => {
        return getFormattedDate(appointment.attributes.startTime, 'yyyy')
      })

      // Group appointments by year by month next, resulting object is { year: { month1: [ list for month1 ], month2: [ list for month2 ] } }
      _.map(initialAppointmentsByYear, (listOfAppointmentsInYear, year) => {
        appointmentsByYear[year] = _.groupBy(listOfAppointmentsInYear, (appointment): number => {
          return new Date(appointment.attributes.startTime).getUTCMonth()
        })
      })
    }

    return {
      ...state,
      error,
      loading: false,
    }
  },
  APPOINTMENTS_GET_APPOINTMENT: (state, { appointmentID }) => {
    const appointment = state.appointmentsList?.find((singleAppointment) => singleAppointment.id === appointmentID)
    return {
      ...state,
      appointment,
    }
  },
})
