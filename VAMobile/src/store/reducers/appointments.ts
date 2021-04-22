import _ from 'underscore'

import { AppointmentCancellationStatusConstants, AppointmentCancellationStatusTypes, AppointmentsErrorServiceTypesConstants, AppointmentsGetData } from 'store/api/types'
import { AppointmentData, AppointmentStatusConstants, AppointmentsGroupedByYear, AppointmentsList, AppointmentsMap, AppointmentsMetaError } from 'store/api'
import { TimeFrameType } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import createReducer from './createReducer'

// Data for tracking if the last page is the end
export type loadedMetaData = {
  lastPageNumberLoaded: number
  isLastPageEnd: boolean
}

// MISC data used in UpcomingAppointments and PastAppointments components to show/control pagination
export type PageMetaData = loadedMetaData & {
  numberOfItems: number
  curPageNumber: number
}

// Tracking timeFrame metaData(ex. last page loaded, is it the last page)
export type LoadedAppointmentsMetaData = {
  upcoming: loadedMetaData
  pastThreeMonths: loadedMetaData
  pastFiveToThreeMonths: loadedMetaData
  pastEightToSixMonths: loadedMetaData
  pastElevenToNineMonths: loadedMetaData
  pastAllCurrentYear: loadedMetaData
  pastAllLastYear: loadedMetaData
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
  upcomingAppointmentsByYear?: AppointmentsGroupedByYear
  upcomingAppointmentsById?: AppointmentsMap
  pastAppointmentsByYear?: AppointmentsGroupedByYear
  pastAppointmentsById?: AppointmentsMap
  upcomingVaServiceError: boolean
  upcomingCcServiceError: boolean
  pastVaServiceError: boolean
  pastCcServiceError: boolean
  loadedAppointments: LoadedAppointments
  loadedAppointmentsMetaData: LoadedAppointmentsMetaData
  upcomingPageMetaData?: PageMetaData
  pastPageMetaData?: PageMetaData
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  loadingAppointmentCancellation: false,
  appointmentCancellationStatus: undefined,
  appointment: {} as AppointmentData,
  upcomingAppointmentsByYear: {} as AppointmentsGroupedByYear,
  upcomingAppointmentsById: {} as AppointmentsMap,
  pastAppointmentsByYear: {} as AppointmentsGroupedByYear,
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
  loadedAppointmentsMetaData: {
    upcoming: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
    },
    pastThreeMonths: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
    },
    pastFiveToThreeMonths: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
    },
    pastEightToSixMonths: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
    },
    pastElevenToNineMonths: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
    },
    pastAllCurrentYear: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
    },
    pastAllLastYear: {
      isLastPageEnd: false,
      lastPageNumberLoaded: 0,
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

export const getLoadedMetaData = (appointments: AppointmentsGetData | undefined, lastPage: number): loadedMetaData => {
  return {
    lastPageNumberLoaded: lastPage,
    isLastPageEnd: !appointments?.links?.next,
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
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: (state, { appointmentsList, timeFrame, error, page = 0, apiCalled }) => {
    const appointmentData = appointmentsList?.data || []
    const appointmentsMetaErrors = appointmentsList?.meta?.errors
    const appointmentsByYear: AppointmentsGroupedByYear = groupAppointmentsByYear(appointmentData)
    const appointmentsMap: AppointmentsMap = mapAppointmentsById(appointmentData)
    const { vaServiceError, ccServiceError } = findAppointmentErrors(appointmentsMetaErrors)

    const timeFrameString = timeFrame === TimeFrameType.UPCOMING ? 'upcoming' : 'past'
    const loadedAppointmentKey = getLoadedAppointmentsKey(timeFrame) as keyof LoadedAppointments
    const currAppointmentList = state.loadedAppointments[loadedAppointmentKey]

    // keep track of the latest(whenever api is called) metaData otherwise use old one
    const loadedMetaData = getLoadedMetaData(appointmentsList, page)
    const updatedMetaData = apiCalled ? loadedMetaData : state.loadedAppointmentsMetaData[loadedAppointmentKey]

    return {
      ...state,
      [`${timeFrameString}AppointmentsByYear`]: appointmentsByYear,
      [`${timeFrameString}AppointmentsById`]: appointmentsMap,
      [`${timeFrameString}VaServiceError`]: vaServiceError,
      [`${timeFrameString}CcServiceError`]: ccServiceError,
      error,
      loading: false,
      loadedAppointments: {
        ...state.loadedAppointments,
        // only added appointments if the api was called
        [loadedAppointmentKey]: apiCalled ? currAppointmentList?.concat(appointmentData) : currAppointmentList,
      },
      loadedAppointmentsMetaData: {
        ...state.loadedAppointmentsMetaData,
        [loadedAppointmentKey]: updatedMetaData,
      },
      [`${timeFrameString}PageMetaData`]: {
        ...updatedMetaData,
        numberOfItems: appointmentData.length,
        curPageNumber: page,
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
  APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS: (state, { upcoming, past, error, apiCalled }) => {
    const upcomingAppointments = upcoming?.data || []
    const pastAppointments = past?.data || []
    const { vaServiceError: upcomingVaServiceError, ccServiceError: upcomingCcServiceError } = findAppointmentErrors(upcoming?.meta?.errors)
    const { vaServiceError: pastVaServiceError, ccServiceError: pastCcServiceError } = findAppointmentErrors(past?.meta?.errors)
    const loadedAppointments = state.loadedAppointments

    // keep track of the latest(whenever api is called) metaData otherwise use old one
    const upcomingUpdatedMetaData = apiCalled?.upcoming ? getLoadedMetaData(upcoming, 1) : state.loadedAppointmentsMetaData.upcoming
    const pastUpdatedMetaData = apiCalled?.past ? getLoadedMetaData(past, 1) : state.loadedAppointmentsMetaData.pastThreeMonths

    return {
      ...state,
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
      loadedAppointments: {
        ...state.loadedAppointments,
        upcoming: apiCalled?.upcoming ? loadedAppointments.upcoming.concat(upcomingAppointments) : loadedAppointments.upcoming,
        pastThreeMonths: apiCalled?.past ? loadedAppointments.pastThreeMonths.concat(pastAppointments) : loadedAppointments.pastThreeMonths,
      },
      loadedAppointmentsMetaData: {
        ...state.loadedAppointmentsMetaData,
        upcoming: upcomingUpdatedMetaData,
        pastThreeMonths: pastUpdatedMetaData,
      },
      upcomingPageMetaData: {
        numberOfItems: upcomingAppointments.length,
        curPageNumber: 1,
        ...upcomingUpdatedMetaData,
      },
      pastPageMetaData: {
        numberOfItems: pastAppointments.length,
        curPageNumber: 1,
        ...pastUpdatedMetaData,
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

    if (appointmentID) {
      currentUpcomingAppointmentsById = state.upcomingAppointmentsById || {}
      currentUpcomingAppointmentsList = state.loadedAppointments.upcoming

      // update the appointment's status in both locations where it is stored
      updatedUpcomingAppointmentsList = _.map(currentUpcomingAppointmentsList, (appointment) => {
        const newAppointment = { ...appointment }

        if (newAppointment.id === appointmentID) {
          newAppointment.attributes.status = AppointmentStatusConstants.CANCELLED
        }

        return { ...newAppointment }
      })

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
      upcomingAppointmentsById: appointmentID ? updatedUpcomingAppointmentsById : state.upcomingAppointmentsById,
      upcomingAppointmentsByYear: appointmentID ? groupAppointmentsByYear(updatedUpcomingAppointmentsList) : state.upcomingAppointmentsByYear,
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
      loadedAppointmentsMetaData: {
        upcoming: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
        pastThreeMonths: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
        pastFiveToThreeMonths: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
        pastEightToSixMonths: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
        pastElevenToNineMonths: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
        pastAllCurrentYear: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
        pastAllLastYear: {
          isLastPageEnd: false,
          lastPageNumberLoaded: 0,
        },
      },
    }
  },
})
