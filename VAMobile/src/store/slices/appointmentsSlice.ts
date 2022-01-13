import * as api from 'store/api'
import { AppThunk } from 'store'
import {
  AppointmentCancellationStatusConstants,
  AppointmentCancellationStatusTypes,
  AppointmentData,
  AppointmentStatusConstants,
  AppointmentTimeZone,
  AppointmentTypeConstants,
  AppointmentsErrorServiceTypesConstants,
  AppointmentsGetData,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMap,
  AppointmentsMetaError,
  AppointmentsMetaPagination,
  Params,
  ScreenIDTypes,
} from 'store/api'
import { CommonErrorTypesConstants } from 'constants/errors'
import { DEFAULT_PAGE_SIZE, MockUsersEmail } from 'constants/common'
import { Events, UserAnalytics } from 'constants/analytics'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getFormattedDate } from 'utils/formattingUtils'
import { getItemsInRange, isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'
import _ from 'underscore'

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
      //All mock data should be removed after backend implementation
      // TODO: delete in story #19175
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      if (signInEmail === MockUsersEmail.user_1414) {
        pastAppointments = {
          data: [
            {
              type: 'appointment',
              id: '4',
              attributes: {
                appointmentType: AppointmentTypeConstants.VA,
                status: AppointmentStatusConstants.BOOKED,
                phoneOnly: false,
                statusDetail: null,
                isCovidVaccine: true,
                startDateLocal: '2021-09-06T19:53:14.000+00:00',
                startDateUtc: '2021-09-06T19:53:14.000+00:00',
                minutesDuration: 60,
                comment: 'Please arrive 20 minutes before the start of your appointment',
                timeZone: 'America/Los_Angeles' as AppointmentTimeZone,
                healthcareService: 'Blind Rehabilitation Center',
                healthcareProvider: null,
                reason: null,
                location: {
                  name: 'VA Long Beach Healthcare System',
                  address: {
                    street: '5901 East 7th Street',
                    city: 'Long Beach',
                    state: 'CA',
                    zipCode: '90822',
                  },
                  phone: {
                    number: '456-7890',
                    extension: '',
                    areaCode: '123',
                  },
                  url: '',
                  code: '',
                },
                practitioner: {
                  prefix: 'Dr.',
                  firstName: 'Larry',
                  middleName: '',
                  lastName: 'TestDoctor',
                },
              },
            },
            {
              id: '2',
              type: 'appointment',
              attributes: {
                appointmentType: AppointmentTypeConstants.VA,
                healthcareService: 'CHY PC VAR2',
                healthcareProvider: null,
                location: {
                  name: 'Cheyenne VA Medical Center',
                  address: {
                    street: '2360 East Pershing Boulevard',
                    city: 'Cheyenne',
                    state: 'WY',
                    zipCode: '82001-5356',
                  },
                  phone: {
                    areaCode: '307',
                    number: '778-7550',
                    extension: '',
                  },
                  url: '',
                  code: '',
                },
                minutesDuration: 60,
                phoneOnly: true,
                isCovidVaccine: false,
                startDateLocal: '2021-09-17T13:10:00.000-06:00',
                startDateUtc: '2021-09-17T19:10:00.000+00:00',
                status: AppointmentStatusConstants.BOOKED,
                statusDetail: null,
                timeZone: 'America/Denver' as AppointmentTimeZone,
                comment: '',
                reason: null,
              },
            },
          ],
        }
      } else {
        if (loadedPastAppointments) {
          pastAppointments = loadedPastAppointments
        } else {
          pastAppointments = await api.get<AppointmentsGetData>('/v0/appointments', {
            startDate: past.startDate,
            endDate: past.endDate,
            'page[size]': DEFAULT_PAGE_SIZE.toString(),
            'page[number]': '1', // prefetch assume always first page
            sort: '-startDateUtc', // reverse sort for past timeRanges so it shows most recent to oldest
          } as Params)
        }
      }

      if (signInEmail === MockUsersEmail.user_1414) {
        upcomingAppointments = {
          data: [
            {
              type: 'appointment',
              id: '1',
              attributes: {
                appointmentType: AppointmentTypeConstants.VA,
                status: AppointmentStatusConstants.CANCELLED,
                phoneOnly: false,
                statusDetail: null,
                isCovidVaccine: true,
                startDateLocal: '2022-09-06T19:53:14.000+00:00',
                startDateUtc: '2022-09-06T19:53:14.000+00:00',
                minutesDuration: 60,
                comment: 'Please arrive 20 minutes before the start of your appointment',
                timeZone: 'America/Los_Angeles' as AppointmentTimeZone,
                healthcareService: 'Blind Rehabilitation Center',
                healthcareProvider: null,
                reason: null,
                location: {
                  name: 'VA Long Beach Healthcare System',
                  address: {
                    street: '5901 East 7th Street',
                    city: 'Long Beach',
                    state: 'CA',
                    zipCode: '90822',
                  },
                  phone: {
                    number: '456-7890',
                    extension: '',
                    areaCode: '123',
                  },
                  url: '',
                  code: '',
                },
                practitioner: {
                  prefix: 'Dr.',
                  firstName: 'Larry',
                  middleName: '',
                  lastName: 'TestDoctor',
                },
              },
            },
            {
              id: '2',
              type: 'appointment',
              attributes: {
                appointmentType: AppointmentTypeConstants.VA,
                healthcareService: 'CHY PC VAR2',
                healthcareProvider: null,
                location: {
                  name: 'Cheyenne VA Medical Center',
                  address: {
                    street: '2360 East Pershing Boulevard',
                    city: 'Cheyenne',
                    state: 'WY',
                    zipCode: '82001-5356',
                  },
                  phone: {
                    areaCode: '307',
                    number: '778-7550',
                    extension: '',
                  },
                  url: '',
                  code: '',
                },
                minutesDuration: 60,
                phoneOnly: false,
                isCovidVaccine: true,
                startDateLocal: '2022-09-17T13:10:00.000-06:00',
                startDateUtc: '2022-09-17T19:10:00.000+00:00',
                status: AppointmentStatusConstants.BOOKED,
                statusDetail: null,
                timeZone: 'America/Denver' as AppointmentTimeZone,
                comment: '',
                reason: null,
              },
            },
            {
              id: '3',
              type: 'appointment',
              attributes: {
                appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
                cancelId: '',
                comment: '',
                healthcareService: 'CHEYENNE VAMC',
                healthcareProvider: null,
                location: {
                  name: 'Cheyenne VA Medical Center',
                  address: {
                    street: '2360 East Pershing Boulevard',
                    city: 'Cheyenne',
                    state: 'WY',
                    zipCode: '82001-5356',
                  },
                  phone: {
                    areaCode: '307',
                    number: '778-7550',
                    extension: '',
                  },
                  url: 'https://dev.care.va.gov/vvc-app/?name=NADEAU%2CMARCY&join=1&media=1&escalate=1&conference=VAC000416762@dev.care.va.gov&pin=990510&aid=c821687c-5844-4421-9180-dcc18236a62a#',
                  code: '990510#',
                },
                minutesDuration: 20,
                phoneOnly: false,
                startDateLocal: '2022-09-01T11:15:00.000-06:00',
                startDateUtc: '2022-09-01T17:15:00.000+00:00',
                status: AppointmentStatusConstants.BOOKED,
                statusDetail: null,
                timeZone: 'America/Denver' as AppointmentTimeZone,
                reason: null,
                isCovidVaccine: false,
              },
            },
          ],
          meta: {
            errors: [{ source: AppointmentsErrorServiceTypesConstants.COMMUNITY_CARE }],
            dataFromStore: false,
          },
        }
      } else {
        // use loaded data if we have it
        const loadedUpcomingAppointments = getLoadedAppointments(loadedUpcoming, upcomingPagination, 1, DEFAULT_PAGE_SIZE)
        if (loadedUpcomingAppointments) {
          upcomingAppointments = loadedUpcomingAppointments
        } else {
          upcomingAppointments = await api.get<AppointmentsGetData>('/v0/appointments', {
            startDate: upcoming.startDate,
            endDate: upcoming.endDate,
            'page[size]': DEFAULT_PAGE_SIZE.toString(),
            'page[number]': '1', // prefetch assume always first page
            sort: 'startDateUtc',
          } as Params)
        }
      }
      dispatch(dispatchFinishPrefetchAppointments({ upcoming: upcomingAppointments, past: pastAppointments }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishPrefetchAppointments({ upcoming: undefined, past: undefined, error }))
        dispatch(dispatchSetError({ errorType: CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD, screenID }))
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
      } as Params)
      dispatch(dispatchFinishGetAppointmentsInDateRange({ timeFrame, appointments: appointmentsList }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetAppointmentsInDateRange({ timeFrame, appointments: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to cancel appointment associated with the given cancelID
 */
export const cancelAppointment =
  (cancelID?: string, appointmentID?: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(cancelAppointment(cancelID, appointmentID))))
    dispatch(dispatchStartCancelAppointment())

    try {
      await api.put('/v0/appointments/cancel/' + cancelID)
      await registerReviewEvent()
      dispatch(dispatchFinishCancelAppointment({ appointmentID }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishCancelAppointment({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to get a single appointment
 */
export const getAppointment =
  (appointmentID: string): AppThunk =>
  async (dispatch, getState) => {
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
    const [totalTime] = getAnalyticsTimers(getState())
    await logAnalyticsEvent(Events.vama_ttv_appt_details(totalTime))
    await registerReviewEvent()
    await dispatch(resetAnalyticsActionStart())
    await dispatch(setAnalyticsTotalTimeStart())
    dispatch(dispatchGetAppointment(appointmentID))
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

    dispatchGetAppointment: (state, action: PayloadAction<string>) => {
      const appointmentID = action.payload
      const { upcomingAppointmentsById = {}, pastAppointmentsById = {} } = state
      const appointment: AppointmentData = upcomingAppointmentsById[appointmentID] || pastAppointmentsById[appointmentID]

      state.appointment = appointment
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
  dispatchGetAppointment,
  dispatchStartCancelAppointment,
  dispatchClearAppointmentCancellation,
  dispatchClearLoadedAppointments,
  dispatchFinishCancelAppointment,
} = appointmentsSlice.actions

export default appointmentsSlice.reducer
