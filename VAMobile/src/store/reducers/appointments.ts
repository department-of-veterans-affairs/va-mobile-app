import _ from 'underscore'

import { AppointmentData, AppointmentStatusConstants, AppointmentsGroupedByYear, AppointmentsList, AppointmentsMap, AppointmentsMetaError } from 'store/api'
import { AppointmentsErrorServiceTypesConstants } from 'store/api/types'
import { TimeFrameType } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import createReducer from './createReducer'

export type AppointmentsState = {
  loading: boolean
  loadingAppointmentCancellation: boolean
  error?: Error
  appointment?: AppointmentData
  pastAppointmentsByYear?: AppointmentsGroupedByYear
  upcomingAppointmentsList?: Array<AppointmentData>
  upcomingAppointmentsByYear?: AppointmentsGroupedByYear
  upcomingAppointmentsById?: AppointmentsMap
  pastAppointmentsById?: AppointmentsMap
  upcomingVaServiceError: boolean
  upcomingCcServiceError: boolean
  pastVaServiceError: boolean
  pastCcServiceError: boolean
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  loadingAppointmentCancellation: false,
  appointment: {} as AppointmentData,
  pastAppointmentsByYear: {} as AppointmentsGroupedByYear,
  upcomingAppointmentsByYear: {} as AppointmentsGroupedByYear,
  upcomingAppointmentsById: {} as AppointmentsMap,
  pastAppointmentsById: {} as AppointmentsMap,
  upcomingVaServiceError: false,
  upcomingCcServiceError: false,
  pastVaServiceError: false,
  pastCcServiceError: false,
}

export const groupAppointmentsByYear = (appointmentsList?: AppointmentsList): AppointmentsGroupedByYear => {
  const appointmentsByYear: AppointmentsGroupedByYear = {}

  // Group appointments by year, resulting object is { year: [ list of appointments for year ] }
  const initialAppointmentsByYear = _.groupBy(appointmentsList || [], (appointment) => {
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

export const mapAppointmentsById = (appointmentsList?: AppointmentsList): AppointmentsMap => {
  const appointmentsMap = {} as AppointmentsMap

  // map appointments by id
  _.each(appointmentsList || [], (appointment) => {
    appointmentsMap[appointment.id] = appointment
  })

  return appointmentsMap
}

export const findAppointmentErrors = (appointmentsMetaErrors?: Array<AppointmentsMetaError>): { vaServiceError: boolean; ccServiceError: boolean } => {
  const vaServiceError = !!appointmentsMetaErrors?.find((error) => {
    return error.source === AppointmentsErrorServiceTypesConstants.VA
  })

  const ccServiceError = !!appointmentsMetaErrors?.find((error) => {
    return error.source === AppointmentsErrorServiceTypesConstants.COMMUNITY_CARE
  })

  return {
    vaServiceError,
    ccServiceError,
  }
}

export default createReducer<AppointmentsState>(initialAppointmentsState, {
  APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: (state, { appointmentsList = [], appointmentsMetaErrors, timeFrame, error }) => {
    const appointmentsByYear: AppointmentsGroupedByYear = groupAppointmentsByYear(appointmentsList)
    const appointmentsMap: AppointmentsMap = mapAppointmentsById(appointmentsList)
    const { vaServiceError, ccServiceError } = findAppointmentErrors(appointmentsMetaErrors)

    const timeFrameString = timeFrame === TimeFrameType.UPCOMING ? 'upcoming' : 'past'

    return {
      ...state,
      [`${timeFrameString}AppointmentsByYear`]: appointmentsByYear,
      [`${timeFrameString}AppointmentsById`]: appointmentsMap,
      [`${timeFrameString}VaServiceError`]: vaServiceError,
      [`${timeFrameString}CcServiceError`]: ccServiceError,
      error,
      loading: false,
    }
  },
  APPOINTMENTS_GET_APPOINTMENT: (state, { appointmentID }) => {
    const { upcomingAppointmentsById = {}, pastAppointmentsById = {} } = state
    const appointment: AppointmentData = upcomingAppointmentsById[appointmentID] || pastAppointmentsById[appointmentID]

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
  APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS: (state, { upcoming, past, error }) => {
    const upcomingAppointments = upcoming?.data
    const pastAppointments = past?.data
    const { vaServiceError: upcomingVaServiceError, ccServiceError: upcomingCcServiceError } = findAppointmentErrors(upcoming?.meta?.errors)
    const { vaServiceError: pastVaServiceError, ccServiceError: pastCcServiceError } = findAppointmentErrors(past?.meta?.errors)

    return {
      ...state,
      upcomingAppointmentsList: upcomingAppointments,
      upcomingAppointmentsByYear: groupAppointmentsByYear(upcomingAppointments),
      pastAppointmentsByYear: groupAppointmentsByYear(pastAppointments),
      upcomingAppointmentsById: mapAppointmentsById(upcomingAppointments),
      pastAppointmentsById: mapAppointmentsById(pastAppointments),
      upcomingVaServiceError,
      upcomingCcServiceError,
      pastVaServiceError,
      pastCcServiceError,
      error,
      loading: false,
    }
  },
  APPOINTMENTS_START_CANCEL_APPOINTMENT: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingAppointmentCancellation: true,
    }
  },
  APPOINTMENTS_FINISH_CANCEL_APPOINTMENT: (state, { appointmentID, error }) => {
    let currentUpcomingAppointmentsById
    let currentUpcomingAppointmentsList
    let updatedUpcomingAppointmentsList
    let updatedUpcomingAppointmentsById

    if (appointmentID) {
      currentUpcomingAppointmentsById = state.upcomingAppointmentsById ? state.upcomingAppointmentsById : {}
      currentUpcomingAppointmentsList = state.upcomingAppointmentsList ? state.upcomingAppointmentsList : []
      updatedUpcomingAppointmentsList = _.map(currentUpcomingAppointmentsList, (appointment) => ({ ...appointment }))

      // update the appointment's status in both locations where it is stored
      updatedUpcomingAppointmentsById = {
        ...state.upcomingAppointmentsById,
        [appointmentID]: {
          ...currentUpcomingAppointmentsById[appointmentID],
          attributes: {
            ...currentUpcomingAppointmentsById[appointmentID]?.attributes,
            status: AppointmentStatusConstants.CANCELLED,
          },
        },
      }

      _.each(updatedUpcomingAppointmentsList, (appointment) => {
        if (appointment.id === appointmentID) {
          appointment.attributes.status = AppointmentStatusConstants.CANCELLED
        }
      })
    }

    return {
      ...state,
      error,
      upcomingAppointmentsById: appointmentID ? updatedUpcomingAppointmentsById : state.upcomingAppointmentsById,
      upcomingAppointmentsByYear: appointmentID ? groupAppointmentsByYear(updatedUpcomingAppointmentsList) : state.upcomingAppointmentsByYear,
      loadingAppointmentCancellation: false,
    }
  },
})
