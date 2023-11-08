import * as api from 'store/api'
import { AppThunk } from 'store'
import {
  AppointmentCancellationStatusConstants,
  AppointmentCancellationStatusTypes,
  AppointmentData,
  AppointmentStatusConstants,
  AppointmentsErrorServiceTypesConstants,
  AppointmentsGetData,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMap,
  AppointmentsMetaError,
  AppointmentsMetaPagination,
  ScreenIDTypes,
} from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Events, UserAnalytics } from 'constants/analytics'
import { Params } from 'store/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getFormattedDate } from 'utils/formattingUtils'
import { getItemsInRange, isErrorObject, showSnackBar } from 'utils/common'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'
import _ from 'underscore'

const appointmenNonFatalErrorString = 'Appointments Service Error'

const emptyAppointmentsInDateRange: AppointmentsGetData = {
  data: [],
  meta: {
    dataFromStore: false,
    errors: [],
    pagination: {
      totalEntries: 0,
      currentPage: 1,
      perPage: DEFAULT_PAGE_SIZE,
    },
  },
}

export type AppointmentsDateRange = {
  startDate: string
  endDate: string
}

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
  currentPageAppointmentsByYear: CurrentPageAppointmentsByYear
  upcomingAppointmentsById?: AppointmentsMap
  pastAppointmentsById?: AppointmentsMap
  upcomingVaServiceError: boolean
  upcomingCcServiceError: boolean
  pastVaServiceError: boolean
  pastCcServiceError: boolean
  loadedAppointmentsByTimeFrame: LoadedAppointments
  paginationByTimeFrame: AppointmentsPaginationByTimeFrame
  messagesLoading: boolean
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
  messagesLoading: false,
}

// Issue#2273 Tracks and logs pagination warning if there are discrepancies in the total entries of appointments
const trackAppointmentPaginationDiscrepancy = async (previousPagination: AppointmentsMetaPagination, currentPagination?: AppointmentsMetaPagination): Promise<void> => {
  // skip first call by checking against the initial state
  if (
    previousPagination.totalEntries === initialPaginationState.totalEntries &&
    previousPagination.currentPage === initialPaginationState.currentPage &&
    previousPagination.perPage === initialPaginationState.perPage
  ) {
    return
  }

  // As a user paginates, if there is a delta in the numbers of totalEntries then we know a discrepancy has occurred
  if (previousPagination?.totalEntries !== currentPagination?.totalEntries) {
    await logAnalyticsEvent(Events.vama_appts_page_warning())
  }
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

// Return data that looks like AppointmentsGetData if data was loaded previously otherwise null
const getLoadedAppointments = (appointments: Array<AppointmentData>, paginationData: AppointmentsMetaPagination, latestPage: number, pageSize: number) => {
  const loadedAppointments = getItemsInRange(appointments, latestPage, pageSize)
  // do we have the appointments?
  if (loadedAppointments) {
    return {
      data: loadedAppointments,
      meta: {
        pagination: {
          currentPage: latestPage,
          perPage: pageSize,
          totalEntries: paginationData.totalEntries,
        },
        dataFromStore: true, // informs reducer not to save these appointments to the store
      },
    } as AppointmentsGetData
  }
  return null
}

/**
 * Redux action to prefetch appointments for upcoming and past the given their date ranges
 */
export const prefetchAppointments =
  (upcoming: AppointmentsDateRange, past: AppointmentsDateRange, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchAppointments(upcoming, past, screenID))))
    dispatch(dispatchStartPrefetchAppointments())

    const { upcoming: loadedUpcoming, pastThreeMonths: loadedPastThreeMonths } = getState().appointments.loadedAppointmentsByTimeFrame
    const { upcoming: upcomingPagination, pastThreeMonths: pastPagination } = getState().appointments.paginationByTimeFrame
    try {
      let upcomingAppointments
      let pastAppointments

      // use loaded data if we have it
      const loadedPastAppointments = getLoadedAppointments(loadedPastThreeMonths, pastPagination, 1, DEFAULT_PAGE_SIZE)
      if (loadedPastAppointments && getState().appointments.pastCcServiceError === false && getState().appointments.pastVaServiceError === false) {
        pastAppointments = loadedPastAppointments
      } else {
        pastAppointments = await api.get<AppointmentsGetData>('/v0/appointments', {
          startDate: past.startDate,
          endDate: past.endDate,
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          'page[number]': '1', // prefetch assume always first page
          sort: '-startDateUtc', // reverse sort for past timeRanges so it shows most recent to oldest,
          'included[]': 'pending',
        } as Params)
      }

      // use loaded data if we have it
      const loadedUpcomingAppointments = getLoadedAppointments(loadedUpcoming, upcomingPagination, 1, DEFAULT_PAGE_SIZE)
      if (loadedUpcomingAppointments && getState().appointments.upcomingCcServiceError === false && getState().appointments.upcomingVaServiceError === false) {
        upcomingAppointments = loadedUpcomingAppointments
      } else {
        upcomingAppointments = await api.get<AppointmentsGetData>('/v0/appointments', {
          startDate: upcoming.startDate,
          endDate: upcoming.endDate,
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          'page[number]': '1', // prefetch assume always first page
          sort: 'startDateUtc',
          'included[]': 'pending',
        } as Params)
      }

      dispatch(dispatchFinishPrefetchAppointments({ upcoming: upcomingAppointments, past: pastAppointments }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `prefetchAppointments: ${appointmenNonFatalErrorString}`)
        dispatch(dispatchFinishPrefetchAppointments({ upcoming: undefined, past: undefined, error }))
        dispatch(dispatchSetError({ errorType: CommonErrorTypesConstants.APP_LEVEL_ERROR_APPOINTMENTS, screenID }))
      }
    }
  }

/**
 * Redux action to get all appointments in the given date range
 */
export const getAppointmentsInDateRange =
  (startDate: string, endDate: string, timeFrame: TimeFrameType, page: number, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppointmentsInDateRange(startDate, endDate, timeFrame, page, screenID))))
    dispatch(dispatchStartGetAppointmentsInDateRange())

    const appointmentsState = getState().appointments
    // get stored list of appointments based on timeFrame
    const appointments = appointmentsState.loadedAppointmentsByTimeFrame[timeFrame]
    const appointmentsPagination = appointmentsState.paginationByTimeFrame[timeFrame]

    // return loaded data if we have it
    const loadedAppointments = getLoadedAppointments(appointments, appointmentsPagination, page, DEFAULT_PAGE_SIZE)
    if (loadedAppointments) {
      dispatch(dispatchFinishGetAppointmentsInDateRange({ timeFrame, appointments: loadedAppointments }))
      return
    }

    try {
      const appointmentsList = await api.get<AppointmentsGetData>('/v0/appointments', {
        startDate,
        endDate,
        'page[number]': page.toString(),
        'page[size]': DEFAULT_PAGE_SIZE.toString(),
        sort: `${timeFrame !== TimeFrameTypeConstants.UPCOMING ? '-' : ''}startDateUtc`, // reverse sort for past timeRanges so it shows most recent to oldest
        'included[]': 'pending',
      } as Params)
      await trackAppointmentPaginationDiscrepancy(appointmentsPagination, appointmentsList?.meta?.pagination)
      dispatch(dispatchFinishGetAppointmentsInDateRange({ timeFrame, appointments: appointmentsList }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getAppointmentsInDateRange: ${appointmenNonFatalErrorString}`)
        dispatch(dispatchFinishGetAppointmentsInDateRange({ timeFrame, appointments: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to cancel appointment associated with the given cancelID
 */
export const cancelAppointment =
  (cancelID?: string, appointmentID?: string, isPendingAppointment?: boolean, status?: string, type?: string, days_to_apt?: number): AppThunk =>
  async (dispatch) => {
    const retryFunction = () => dispatch(cancelAppointment(cancelID, appointmentID, isPendingAppointment, status, type, days_to_apt))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartCancelAppointment())

    try {
      await api.put('/v0/appointments/cancel/' + cancelID)
      await registerReviewEvent()
      dispatch(dispatchFinishCancelAppointment({ appointmentID }))
      await logAnalyticsEvent(Events.vama_appt_cancel(!!isPendingAppointment, appointmentID, status, type, days_to_apt))
      // TODO refactor translation to work in store
      const successText = isPendingAppointment ? 'Request canceled' : 'Appointment canceled'
      showSnackBar(successText, dispatch, undefined, true, false, true)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `cancelAppointment: ${appointmenNonFatalErrorString}`)
        dispatch(dispatchFinishCancelAppointment({ error }))
        // TODO refactor translation to work in store
        const errorText = isPendingAppointment ? 'Request not canceled.' : 'Appointment not canceled.'
        showSnackBar(errorText, dispatch, retryFunction, false, true, true)
      }
    }
  }

/**
 * Redux action to track appointment details
 */
export const trackAppointmentDetail =
  (isPendingAppointment?: boolean, appointmentID?: string, status?: string, type?: string, days_to_apt?: number): AppThunk =>
  async (dispatch) => {
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
    await logAnalyticsEvent(Events.vama_appt_view_details(!!isPendingAppointment, appointmentID, status, type, days_to_apt))
    await registerReviewEvent()
    await dispatch(resetAnalyticsActionStart())
    await dispatch(setAnalyticsTotalTimeStart())
  }

/**
 * Redux action to reset appointment cancellation state
 */
export const clearAppointmentCancellation = (): AppThunk => async (dispatch) => {
  dispatch(dispatchClearAppointmentCancellation())
}

/**
 * Redux slice that will create the actions and reducers
 */
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: initialAppointmentsState,
  reducers: {
    dispatchFinishGetAppointmentsInDateRange: (state, action: PayloadAction<{ timeFrame: TimeFrameType; appointments?: AppointmentsGetData; error?: Error }>) => {
      const { appointments, timeFrame, error } = action.payload
      const appointmentInfo = appointments || emptyAppointmentsInDateRange
      const appointmentData = appointmentInfo?.data || []
      const appointmentsMetaErrors = appointmentInfo?.meta?.errors
      const appointmentsByYear: AppointmentsGroupedByYear = groupAppointmentsByYear(appointmentData)
      const appointmentsMap: AppointmentsMap = mapAppointmentsById(appointmentData)
      const { vaServiceError, ccServiceError } = findAppointmentErrors(appointmentsMetaErrors)
      const currAppointmentList = state.loadedAppointmentsByTimeFrame[timeFrame]

      if (timeFrame === TimeFrameTypeConstants.UPCOMING) {
        state.upcomingAppointmentsById = appointmentsMap
        state.upcomingCcServiceError = ccServiceError
        state.upcomingVaServiceError = vaServiceError
      } else {
        state.pastAppointmentsById = appointmentsMap
        state.pastCcServiceError = ccServiceError
        state.pastVaServiceError = vaServiceError
      }

      state.error = error
      state.loading = false
      state.currentPageAppointmentsByYear[timeFrame] = appointmentsByYear
      // only added appointments if the api was called
      state.loadedAppointmentsByTimeFrame[timeFrame] = appointmentInfo?.meta?.dataFromStore ? currAppointmentList : currAppointmentList?.concat(appointmentData)
      state.paginationByTimeFrame[timeFrame] = appointmentInfo?.meta?.pagination || initialPaginationState
    },

    dispatchStartGetAppointmentsInDateRange: (state) => {
      state.loading = true
    },

    dispatchStartPrefetchAppointments: (state) => {
      state.loading = true
    },

    dispatchFinishPrefetchAppointments: (state, action: PayloadAction<{ upcoming?: AppointmentsGetData; past?: AppointmentsGetData; error?: Error }>) => {
      const { upcoming, past, error } = action.payload
      const upcomingAppointments = upcoming?.data || []
      const pastAppointments = past?.data || []
      const { vaServiceError: upcomingVaServiceError, ccServiceError: upcomingCcServiceError } = findAppointmentErrors(upcoming?.meta?.errors)
      const { vaServiceError: pastVaServiceError, ccServiceError: pastCcServiceError } = findAppointmentErrors(past?.meta?.errors)
      const loadedAppointmentsByTimeFrame = state.loadedAppointmentsByTimeFrame
      const upcomingAppointmentsPagination = upcoming?.meta?.pagination || state.paginationByTimeFrame.upcoming
      const pastAppointmentsPagination = past?.meta?.pagination || state.paginationByTimeFrame.pastThreeMonths

      state.upcomingAppointmentsById = mapAppointmentsById(upcomingAppointments)
      state.pastAppointmentsById = mapAppointmentsById(pastAppointments)
      state.upcomingCcServiceError = upcomingCcServiceError
      state.upcomingVaServiceError = upcomingVaServiceError
      state.pastCcServiceError = pastCcServiceError
      state.pastVaServiceError = pastVaServiceError
      state.error = error
      state.loading = false

      state.currentPageAppointmentsByYear.upcoming = groupAppointmentsByYear(upcomingAppointments)
      state.currentPageAppointmentsByYear.pastThreeMonths = groupAppointmentsByYear(pastAppointments)

      state.loadedAppointmentsByTimeFrame.upcoming = upcoming?.meta?.dataFromStore
        ? loadedAppointmentsByTimeFrame.upcoming
        : loadedAppointmentsByTimeFrame.upcoming.concat(upcomingAppointments)

      state.loadedAppointmentsByTimeFrame.pastThreeMonths = past?.meta?.dataFromStore
        ? loadedAppointmentsByTimeFrame.pastThreeMonths
        : loadedAppointmentsByTimeFrame.pastThreeMonths.concat(pastAppointments)

      state.paginationByTimeFrame.upcoming = upcomingAppointmentsPagination
      state.paginationByTimeFrame.pastThreeMonths = pastAppointmentsPagination
    },

    dispatchStartCancelAppointment: (state) => {
      state.loadingAppointmentCancellation = true
    },

    dispatchFinishCancelAppointment: (state, action: PayloadAction<{ appointmentID?: string; error?: Error }>) => {
      const { appointmentID, error } = action.payload
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
        updatedCurrentPageUpcomingAppointmentsByYear = groupAppointmentsByYear(
          getItemsInRange(updatedUpcomingAppointmentsList, currentPageData.currentPage, currentPageData.perPage),
        )

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

      state.error = error
      state.upcomingAppointmentsById = updatedUpcomingAppointmentsById || state.upcomingAppointmentsById
      state.currentPageAppointmentsByYear.upcoming = updatedCurrentPageUpcomingAppointmentsByYear || state.currentPageAppointmentsByYear.upcoming
      state.loadedAppointmentsByTimeFrame.upcoming = updatedUpcomingAppointmentsList || state.loadedAppointmentsByTimeFrame.upcoming
      state.loadingAppointmentCancellation = false
      state.appointmentCancellationStatus = error ? AppointmentCancellationStatusConstants.FAIL : AppointmentCancellationStatusConstants.SUCCESS
    },

    dispatchClearAppointmentCancellation: (state) => {
      state.appointmentCancellationStatus = undefined
    },

    dispatchClearLoadedAppointments: () => {
      return { ...initialAppointmentsState }
    },
  },
})

export const {
  dispatchFinishGetAppointmentsInDateRange,
  dispatchFinishPrefetchAppointments,
  dispatchStartPrefetchAppointments,
  dispatchStartGetAppointmentsInDateRange,
  dispatchStartCancelAppointment,
  dispatchClearAppointmentCancellation,
  dispatchClearLoadedAppointments,
  dispatchFinishCancelAppointment,
} = appointmentsSlice.actions

export default appointmentsSlice.reducer
