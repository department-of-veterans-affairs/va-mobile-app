import _ from 'underscore'

import { AppointmentCancellationStatusConstants, AppointmentCancellationStatusTypes, AppointmentsErrorServiceTypesConstants, AppointmentsMetaPagination } from 'store/api/types'
import { AppointmentData, AppointmentStatusConstants, AppointmentsGroupedByYear, AppointmentsList, AppointmentsMap, AppointmentsMetaError } from 'store/api'
import { TimeFrameType } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import createReducer from './createReducer'

// Tracking timeFrame AppointmentsMetaPagination
export type loadedAppointmentsMetaPagination = {
  upcoming: AppointmentsMetaPagination
  pastThreeMonths: AppointmentsMetaPagination
  pastFiveToThreeMonths: AppointmentsMetaPagination
  pastEightToSixMonths: AppointmentsMetaPagination
  pastElevenToNineMonths: AppointmentsMetaPagination
  pastAllCurrentYear: AppointmentsMetaPagination
  pastAllLastYear: AppointmentsMetaPagination
}

// Tracking all the already loaded appointments data for each timeFrame
export type LoadedAppointments = {
  upcoming: Array<AppointmentData>
  pastThreeMonths: Array<AppointmentData>
  pastFiveToThreeMonths: Array<AppointmentData>
  pastEightToSixMonths: Array<AppointmentData>
  pastElevenToNineMonths: Array<AppointmentData>
  pastAllCurrentYear: Array<AppointmentData>
  pastAllLastYear: Array<AppointmentData>
}

export type AppointmentsState = {
  loading: boolean
  loadingAppointmentCancellation: boolean
  appointmentCancellationStatus?: AppointmentCancellationStatusTypes
  error?: Error
  appointment?: AppointmentData
  currentPageUpcomingAppointmentsByYear?: AppointmentsGroupedByYear
  currentPagePastAppointmentsByYear?: AppointmentsGroupedByYear
  upcomingAppointmentsById?: AppointmentsMap
  pastAppointmentsById?: AppointmentsMap
  upcomingVaServiceError: boolean
  upcomingCcServiceError: boolean
  pastVaServiceError: boolean
  pastCcServiceError: boolean
  loadedAppointments: LoadedAppointments
  loadedAppointmentsMetaPagination: loadedAppointmentsMetaPagination
  upcomingPageMetaData?: AppointmentsMetaPagination
  pastPageMetaData?: AppointmentsMetaPagination
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  loadingAppointmentCancellation: false,
  appointmentCancellationStatus: undefined,
  appointment: {} as AppointmentData,
  currentPageUpcomingAppointmentsByYear: {} as AppointmentsGroupedByYear,
  upcomingAppointmentsById: {} as AppointmentsMap,
  currentPagePastAppointmentsByYear: {} as AppointmentsGroupedByYear,
  pastAppointmentsById: {} as AppointmentsMap,
  upcomingVaServiceError: false,
  upcomingCcServiceError: false,
  pastVaServiceError: false,
  pastCcServiceError: false,
  loadedAppointments: {
    upcoming: [],
    pastThreeMonths: [],
    pastFiveToThreeMonths: [],
    pastEightToSixMonths: [],
    pastElevenToNineMonths: [],
    pastAllCurrentYear: [],
    pastAllLastYear: [],
  },
  loadedAppointmentsMetaPagination: {
    upcoming: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
    pastThreeMonths: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
    pastFiveToThreeMonths: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
    pastEightToSixMonths: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
    pastElevenToNineMonths: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
    pastAllCurrentYear: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
    pastAllLastYear: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
    },
  },
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

export const getLoadedAppointmentsKey = (timeFrame: TimeFrameType | undefined): string => {
  switch (timeFrame) {
    case TimeFrameType.UPCOMING:
      return 'upcoming'
    case TimeFrameType.PAST_THREE_MONTHS:
      return 'pastThreeMonths'
    case TimeFrameType.PAST_FIVE_TO_THREE_MONTHS:
      return 'pastFiveToThreeMonths'
    case TimeFrameType.PAST_EIGHT_TO_SIX_MONTHS:
      return 'pastEightToSixMonths'
    case TimeFrameType.PAST_ELEVEN_TO_NINE_MONTHS:
      return 'pastElevenToNineMonths'
    case TimeFrameType.PAST_ALL_CURRENT_YEAR:
      return 'pastAllCurrentYear'
    case TimeFrameType.PAST_ALL_LAST_YEAR:
      return 'pastAllLastYear'
    default:
      return ''
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
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: (state, { appointments, timeFrame, error }) => {
    const appointmentData = appointments?.data || []
    const appointmentsMetaErrors = appointments?.meta?.errors
    const appointmentsByYear: AppointmentsGroupedByYear = groupAppointmentsByYear(appointmentData)
    const appointmentsMap: AppointmentsMap = mapAppointmentsById(appointmentData)
    const { vaServiceError, ccServiceError } = findAppointmentErrors(appointmentsMetaErrors)

    const capitalizedTimeFrameString = timeFrame === TimeFrameType.UPCOMING ? 'Upcoming' : 'Past'
    const timeFrameString = timeFrame === TimeFrameType.UPCOMING ? 'upcoming' : 'past'
    const loadedAppointmentKey = getLoadedAppointmentsKey(timeFrame) as keyof LoadedAppointments
    const currAppointmentList = state.loadedAppointments[loadedAppointmentKey]

    return {
      ...state,
      [`currentPage${capitalizedTimeFrameString}AppointmentsByYear`]: appointmentsByYear,
      [`${timeFrameString}AppointmentsById`]: appointmentsMap,
      [`${timeFrameString}VaServiceError`]: vaServiceError,
      [`${timeFrameString}CcServiceError`]: ccServiceError,
      error,
      loading: false,
      loadedAppointments: {
        ...state.loadedAppointments,
        // only added appointments if the api was called
        [loadedAppointmentKey]: appointments?.meta?.dataFromStore ? currAppointmentList : currAppointmentList?.concat(appointmentData),
      },
      loadedAppointmentsMetaPagination: {
        ...state.loadedAppointmentsMetaPagination,
        [loadedAppointmentKey]: appointments?.meta?.pagination,
      },
      [`${timeFrameString}PageMetaData`]: {
        ...appointments?.meta?.pagination,
      },
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
    const upcomingAppointments = upcoming?.data || []
    const pastAppointments = past?.data || []
    const { vaServiceError: upcomingVaServiceError, ccServiceError: upcomingCcServiceError } = findAppointmentErrors(upcoming?.meta?.errors)
    const { vaServiceError: pastVaServiceError, ccServiceError: pastCcServiceError } = findAppointmentErrors(past?.meta?.errors)
    const loadedAppointments = state.loadedAppointments

    const upcomingAppointmentsMetaPagination = upcoming?.meta?.pagination || state.loadedAppointmentsMetaPagination.upcoming
    const pastAppointmentsMetaPagination = past?.meta?.pagination || state.loadedAppointmentsMetaPagination.pastThreeMonths

    return {
      ...state,
      currentPageUpcomingAppointmentsByYear: groupAppointmentsByYear(upcomingAppointments),
      currentPagePastAppointmentsByYear: groupAppointmentsByYear(pastAppointments),
      upcomingAppointmentsById: mapAppointmentsById(upcomingAppointments),
      pastAppointmentsById: mapAppointmentsById(pastAppointments),
      upcomingVaServiceError,
      upcomingCcServiceError,
      pastVaServiceError,
      pastCcServiceError,
      error,
      loading: false,
      loadedAppointments: {
        ...state.loadedAppointments,
        upcoming: upcoming?.meta?.dataFromStore ? loadedAppointments.upcoming : loadedAppointments.upcoming.concat(upcomingAppointments),
        pastThreeMonths: past?.meta?.dataFromStore ? loadedAppointments.pastThreeMonths : loadedAppointments.pastThreeMonths.concat(pastAppointments),
      },
      loadedAppointmentsMetaPagination: {
        ...state.loadedAppointmentsMetaPagination,
        upcoming: upcomingAppointmentsMetaPagination,
        pastThreeMonths: pastAppointmentsMetaPagination,
      },
      upcomingPageMetaData: upcomingAppointmentsMetaPagination,
      pastPageMetaData: pastAppointmentsMetaPagination,
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
    let currentUpcomingAppointmentsByYear
    let updatedUpcomingAppointmentsByYear

    if (appointmentID) {
      currentUpcomingAppointmentsById = state.upcomingAppointmentsById || {}
      currentUpcomingAppointmentsList = state.loadedAppointments.upcoming
      currentUpcomingAppointmentsByYear = state.currentPageUpcomingAppointmentsByYear

      // Update the appointment's status in all locations where it is stored, which is all areas related to upcoming appointments:
      // 1. update in the loaded upcoming appointments list
      updatedUpcomingAppointmentsList = _.map(currentUpcomingAppointmentsList, (appointment) => {
        const newAppointment = { ...appointment }

        if (newAppointment.id === appointmentID) {
          newAppointment.attributes.status = AppointmentStatusConstants.CANCELLED
        }

        return { ...newAppointment }
      })

      // 2. update currentPageUpcomingAppointmentsByYear list
      if (currentUpcomingAppointmentsByYear) {
        // need to fetch specified appointment's year and month to use as keys to update that appointment's attributes section
        const appointment = currentUpcomingAppointmentsById[appointmentID]
        const apptYear = getFormattedDate(appointment.attributes.startDateUtc, 'yyyy')
        const apptMonth = new Date(appointment.attributes.startDateUtc).getUTCMonth()

        const currentYear = currentUpcomingAppointmentsByYear[apptYear]
        const currentMonth = currentYear[apptMonth]

        const updatedMonth = currentMonth.map((appt) => {
          if (appt.id === appointmentID) {
            appt.attributes.status = AppointmentStatusConstants.CANCELLED
          }
          return { ...appt }
        })
        const updatedYear = { ...currentYear, [apptMonth]: updatedMonth }
        updatedUpcomingAppointmentsByYear = { ...currentUpcomingAppointmentsByYear, [apptYear]: updatedYear }
      }

      // 3. update appointment's status in the upcomingAppointmentsById list
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
    }

    return {
      ...state,
      error,
      upcomingAppointmentsById: updatedUpcomingAppointmentsById || state.upcomingAppointmentsById,
      currentPageUpcomingAppointmentsByYear: updatedUpcomingAppointmentsByYear || state.currentPageUpcomingAppointmentsByYear,
      loadedAppointments: {
        ...state.loadedAppointments,
        upcoming: updatedUpcomingAppointmentsList || state.loadedAppointments.upcoming,
      },
      loadingAppointmentCancellation: false,
      appointmentCancellationStatus: error ? AppointmentCancellationStatusConstants.FAIL : AppointmentCancellationStatusConstants.SUCCESS,
    }
  },
  APPOINTMENTS_CLEAR_APPOINTMENT_CANCELLATION: (state, payload) => {
    return {
      ...state,
      ...payload,
      appointmentCancellationStatus: undefined,
    }
  },
  APPOINTMENTS_CLEAR_LOADED_APPOINTMENTS: (state, payload) => {
    return {
      ...state,
      ...payload,
      upcomingPageMetaData: undefined,
      pastPageMetaData: undefined,
      loadedAppointments: {
        upcoming: [],
        pastThreeMonths: [],
        pastFiveToThreeMonths: [],
        pastEightToSixMonths: [],
        pastElevenToNineMonths: [],
        pastAllCurrentYear: [],
        pastAllLastYear: [],
      },
      loadedAppointmentsMetaPagination: {
        upcoming: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
        pastThreeMonths: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
        pastFiveToThreeMonths: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
        pastEightToSixMonths: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
        pastElevenToNineMonths: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
        pastAllCurrentYear: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
        pastAllLastYear: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
        },
      },
    }
  },
})
