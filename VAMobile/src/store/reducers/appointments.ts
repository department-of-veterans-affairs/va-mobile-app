import _ from 'underscore'

import { AppointmentData, AppointmentsGroupedByYear, AppointmentsList, AppointmentsMap } from 'store/api'
import { TimeFrameType } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import createReducer from './createReducer'

export type AppointmentsState = {
  loading: boolean
  error?: Error
  appointment?: AppointmentData
  pastAppointmentsByYear?: AppointmentsGroupedByYear
  upcomingAppointmentsByYear?: AppointmentsGroupedByYear
  upcomingAppointmentsById?: AppointmentsMap
  pastAppointmentsMapById?: AppointmentsMap
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  appointment: {} as AppointmentData,
  pastAppointmentsByYear: {} as AppointmentsGroupedByYear,
  upcomingAppointmentsByYear: {} as AppointmentsGroupedByYear,
  upcomingAppointmentsById: {} as AppointmentsMap,
  pastAppointmentsMapById: {} as AppointmentsMap,
}

export const groupAppointmentsByYear = (appointmentsList: AppointmentsList): AppointmentsGroupedByYear => {
  const appointmentsByYear: AppointmentsGroupedByYear = {}

  // Group appointments by year, resulting object is { year: [ list of appointments for year ] }
  const initialAppointmentsByYear = _.groupBy(appointmentsList, (appointment) => {
    return getFormattedDate(appointment.attributes.startDateUtc, 'yyyy')
  })

  // Group appointments by year by month next, resulting object is { year: { month1: [ list for month1 ], month2: [ list for month2 ] } }
  _.each(initialAppointmentsByYear, (listOfAppointmentsInYear, year) => {
    appointmentsByYear[year] = _.groupBy(listOfAppointmentsInYear, (appointment): number => {
      return new Date(appointment.attributes.startDateUtc).getUTCMonth()
    })
  })

  return appointmentsByYear
}

export const mapAppointmentsById = (appointmentsList: AppointmentsList): AppointmentsMap => {
  const appointmentsMap = {} as AppointmentsMap

  // map appointments by id
  _.each(appointmentsList, (appointment) => {
    appointmentsMap[appointment.id] = appointment
  })

  return appointmentsMap
}

export default createReducer<AppointmentsState>(initialAppointmentsState, {
  APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: (state, { appointmentsList = [], timeFrame, error }) => {
    const appointmentsByYear: AppointmentsGroupedByYear = groupAppointmentsByYear(appointmentsList)
    const appointmentsMap: AppointmentsMap = mapAppointmentsById(appointmentsList)

    const appointmentsTimeFrameByYear = timeFrame === TimeFrameType.UPCOMING ? 'upcomingAppointmentsByYear' : 'pastAppointmentsByYear'
    const appointmentsTimeFrameById = timeFrame === TimeFrameType.UPCOMING ? 'upcomingAppointmentsById' : 'pastAppointmentsMapById'

    return {
      ...state,
      [appointmentsTimeFrameByYear]: appointmentsByYear,
      [appointmentsTimeFrameById]: appointmentsMap,
      error,
      loading: false,
    }
  },
  APPOINTMENTS_GET_APPOINTMENT: (state, { appointmentID }) => {
    const { upcomingAppointmentsById = {}, pastAppointmentsMapById = {} } = state
    const appointment: AppointmentData = upcomingAppointmentsById[appointmentID] || pastAppointmentsMapById[appointmentID]

    return {
      ...state,
      appointment,
    }
  },
  APPOINTMENTS_START_PREFETCH_APPOINTMENTS: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS: (state, { upcoming = [], past = [], error }) => {
    return {
      ...state,
      upcomingAppointmentsByYear: groupAppointmentsByYear(upcoming),
      pastAppointmentsByYear: groupAppointmentsByYear(past),
      upcomingAppointmentsById: mapAppointmentsById(upcoming),
      pastAppointmentsMapById: mapAppointmentsById(past),
      error,
      loading: false,
    }
  },
})
