import _ from 'underscore'

import { AppointmentCancellationStatusConstants, AppointmentCancellationStatusTypes, AppointmentsErrorServiceTypesConstants, AppointmentsMetaPagination } from 'store/api/types'
import { AppointmentData, AppointmentStatusConstants, AppointmentsGroupedByYear, AppointmentsList, AppointmentsMap, AppointmentsMetaError } from 'store/api'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { getFormattedDate } from 'utils/formattingUtils'
import { getItemsInRange } from 'utils/common'
import createReducer from './createReducer'

// Tracking appointments pagination by timeFrame
export type AppointmentsPaginationByTimeFrame = {
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

export type CurrentPageAppointmentsByYear = {
  upcoming: AppointmentsGroupedByYear
  pastThreeMonths: AppointmentsGroupedByYear
  pastFiveToThreeMonths: AppointmentsGroupedByYear
  pastEightToSixMonths: AppointmentsGroupedByYear
  pastElevenToNineMonths: AppointmentsGroupedByYear
  pastAllCurrentYear: AppointmentsGroupedByYear
  pastAllLastYear: AppointmentsGroupedByYear
}

export type AppointmentsState = {
  loading: boolean
  loadingAppointmentCancellation: boolean
  appointmentCancellationStatus?: AppointmentCancellationStatusTypes
  error?: Error
  appointment?: AppointmentData
  currentPageAppointmentsByYear: CurrentPageAppointmentsByYear
  upcomingAppointmentsById?: AppointmentsMap
  pastAppointmentsById?: AppointmentsMap
  upcomingVaServiceError: boolean
  upcomingCcServiceError: boolean
  pastVaServiceError: boolean
  pastCcServiceError: boolean
  loadedAppointmentsByTimeFrame: LoadedAppointments
  paginationByTimeFrame: AppointmentsPaginationByTimeFrame
}

export const initialPaginationState = {
  currentPage: 1,
  totalEntries: 0,
  perPage: 0,
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  loadingAppointmentCancellation: false,
  appointmentCancellationStatus: undefined,
  appointment: {} as AppointmentData,
  upcomingAppointmentsById: {} as AppointmentsMap,
  pastAppointmentsById: {} as AppointmentsMap,
  upcomingVaServiceError: false,
  upcomingCcServiceError: false,
  pastVaServiceError: false,
  pastCcServiceError: false,
  loadedAppointmentsByTimeFrame: {
    upcoming: [],
    pastThreeMonths: [],
    pastFiveToThreeMonths: [],
    pastEightToSixMonths: [],
    pastElevenToNineMonths: [],
    pastAllCurrentYear: [],
    pastAllLastYear: [],
  },
  paginationByTimeFrame: {
    upcoming: initialPaginationState,
    pastThreeMonths: initialPaginationState,
    pastFiveToThreeMonths: initialPaginationState,
    pastEightToSixMonths: initialPaginationState,
    pastElevenToNineMonths: initialPaginationState,
    pastAllCurrentYear: initialPaginationState,
    pastAllLastYear: initialPaginationState,
  },
  currentPageAppointmentsByYear: {
    upcoming: {},
    pastThreeMonths: {},
    pastFiveToThreeMonths: {},
    pastEightToSixMonths: {},
    pastElevenToNineMonths: {},
    pastAllCurrentYear: {},
    pastAllLastYear: {},
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

    const timeFrameString = timeFrame === TimeFrameTypeConstants.UPCOMING ? 'upcoming' : 'past'
    const currAppointmentList = state.loadedAppointmentsByTimeFrame[timeFrame]

    return {
      ...state,
      [`${timeFrameString}AppointmentsById`]: appointmentsMap,
      [`${timeFrameString}VaServiceError`]: vaServiceError,
      [`${timeFrameString}CcServiceError`]: ccServiceError,
      error,
      loading: false,
      currentPageAppointmentsByYear: {
        ...state.currentPageAppointmentsByYear,
        [timeFrame]: appointmentsByYear,
      },
      loadedAppointmentsByTimeFrame: {
        ...state.loadedAppointmentsByTimeFrame,
        // only added appointments if the api was called
        [timeFrame]: appointments?.meta?.dataFromStore ? currAppointmentList : currAppointmentList?.concat(appointmentData),
      },
      paginationByTimeFrame: {
        ...state.paginationByTimeFrame,
        [timeFrame]: appointments?.meta?.pagination,
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
    const loadedAppointmentsByTimeFrame = state.loadedAppointmentsByTimeFrame

    const upcomingAppointmentsPagination = upcoming?.meta?.pagination || state.paginationByTimeFrame.upcoming
    const pastAppointmentsPagination = past?.meta?.pagination || state.paginationByTimeFrame.pastThreeMonths

    return {
      ...state,
      upcomingAppointmentsById: mapAppointmentsById(upcomingAppointments),
      pastAppointmentsById: mapAppointmentsById(pastAppointments),
      upcomingVaServiceError,
      upcomingCcServiceError,
      pastVaServiceError,
      pastCcServiceError,
      error,
      loading: false,
      currentPageAppointmentsByYear: {
        ...state.currentPageAppointmentsByYear,
        upcoming: groupAppointmentsByYear(upcomingAppointments),
        pastThreeMonths: groupAppointmentsByYear(pastAppointments),
      },
      loadedAppointmentsByTimeFrame: {
        ...state.loadedAppointmentsByTimeFrame,
        upcoming: upcoming?.meta?.dataFromStore ? loadedAppointmentsByTimeFrame.upcoming : loadedAppointmentsByTimeFrame.upcoming.concat(upcomingAppointments),
        pastThreeMonths: past?.meta?.dataFromStore ? loadedAppointmentsByTimeFrame.pastThreeMonths : loadedAppointmentsByTimeFrame.pastThreeMonths.concat(pastAppointments),
      },
      paginationByTimeFrame: {
        ...state.paginationByTimeFrame,
        upcoming: upcomingAppointmentsPagination,
        pastThreeMonths: pastAppointmentsPagination,
      },
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
    let updatedCurrentPageUpcomingAppointmentsByYear
    let currentPageData

    if (appointmentID) {
      currentUpcomingAppointmentsById = state.upcomingAppointmentsById || {}
      currentUpcomingAppointmentsList = state.loadedAppointmentsByTimeFrame.upcoming
      currentPageData = state.paginationByTimeFrame.upcoming

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
      updatedCurrentPageUpcomingAppointmentsByYear = groupAppointmentsByYear(getItemsInRange(updatedUpcomingAppointmentsList, currentPageData.currentPage, currentPageData.perPage))

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
      currentPageAppointmentsByYear: {
        ...state.currentPageAppointmentsByYear,
        upcoming: updatedCurrentPageUpcomingAppointmentsByYear || state.currentPageAppointmentsByYear.upcoming,
      },
      loadedAppointmentsByTimeFrame: {
        ...state.loadedAppointmentsByTimeFrame,
        upcoming: updatedUpcomingAppointmentsList || state.loadedAppointmentsByTimeFrame.upcoming,
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
  APPOINTMENTS_CLEAR_LOADED_APPOINTMENTS: (_state, _payload) => {
    return initialAppointmentsState
  },
})
