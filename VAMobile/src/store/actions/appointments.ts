import * as api from 'store/api'
import { AppointmentData } from 'store/api'
import { AppointmentStatusConstants, AppointmentTimeZone, AppointmentTypeConstants, AppointmentsErrorServiceTypesConstants } from 'store/api'
import { AppointmentsGetData, Params, ScreenIDTypes } from 'store/api'
import { AppointmentsMetaPagination } from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Events, UserAnalytics } from 'constants/analytics'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange, isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analytics'

const dispatchStartGetAppointmentsInDateRange = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {},
  }
}

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

const dispatchFinishGetAppointmentsInDateRange = (timeFrame: TimeFrameType, appointments?: AppointmentsGetData, error?: Error): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {
      appointments: appointments || emptyAppointmentsInDateRange,
      error,
      timeFrame,
    },
  }
}

const dispatchStartPrefetchAppointments = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_START_PREFETCH_APPOINTMENTS',
    payload: {},
  }
}

const dispatchFinishPrefetchAppointments = (upcoming?: AppointmentsGetData, past?: AppointmentsGetData, error?: Error): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS',
    payload: {
      upcoming,
      past,
      error,
    },
  }
}

export type AppointmentsDateRange = {
  startDate: string
  endDate: string
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
export const prefetchAppointments = (upcoming: AppointmentsDateRange, past: AppointmentsDateRange, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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
      // TODO: delete in story #19175
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      if (signInEmail === 'vets.gov.user+1414@gmail.com') {
        upcomingAppointments = {
          data: [
            {
              type: 'appointment',
              id: '1',
              attributes: {
                appointmentType: AppointmentTypeConstants.VA,
                status: AppointmentStatusConstants.BOOKED,
                phoneOnly: true,
                statusDetail: null,
                startDateLocal: '2021-09-06T19:53:14.000+00:00',
                startDateUtc: '2021-09-06T19:53:14.000+00:00',
                minutesDuration: 60,
                comment: 'Please arrive 20 minutes before the start of your appointment',
                timeZone: 'America/Los_Angeles' as AppointmentTimeZone,
                healthcareService: 'Blind Rehabilitation Center',
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
                covidVaccination: true,
                startDateLocal: '2021-09-17T13:10:00.000-06:00',
                startDateUtc: '2021-09-17T19:10:00.000+00:00',
                status: AppointmentStatusConstants.CANCELLED,
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
                  url:
                    'https://dev.care.va.gov/vvc-app/?name=NADEAU%2CMARCY&join=1&media=1&escalate=1&conference=VAC000416762@dev.care.va.gov&pin=990510&aid=c821687c-5844-4421-9180-dcc18236a62a#',
                  code: '990510#',
                },
                minutesDuration: 20,
                phoneOnly: false,
                startDateLocal: '2021-09-01T11:15:00.000-06:00',
                startDateUtc: '2021-09-01T17:15:00.000+00:00',
                status: AppointmentStatusConstants.BOOKED,
                statusDetail: null,
                timeZone: 'America/Denver' as AppointmentTimeZone,
                reason: null,
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
      dispatch(dispatchFinishPrefetchAppointments(upcomingAppointments, pastAppointments))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishPrefetchAppointments(undefined, undefined, error))
        dispatch(dispatchSetError(CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD, screenID))
      }
    }
  }
}

/**
 * Redux action to get all appointments in the given date range
 */
export const getAppointmentsInDateRange = (startDate: string, endDate: string, timeFrame: TimeFrameType, page: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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
      dispatch(dispatchFinishGetAppointmentsInDateRange(timeFrame, loadedAppointments))
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
      dispatch(dispatchFinishGetAppointmentsInDateRange(timeFrame, appointmentsList))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetAppointmentsInDateRange(timeFrame, undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

const dispatchGetAppointment = (appointmentID: string): ReduxAction => {
  return {
    type: 'APPOINTMENTS_GET_APPOINTMENT',
    payload: {
      appointmentID,
    },
  }
}

/**
 * Redux action to get a single appointment
 */
export const getAppointment = (appointmentID: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
    const [totalTime] = getAnalyticsTimers(_getState())
    await logAnalyticsEvent(Events.vama_ttv_appt_details(totalTime))
    await registerReviewEvent()
    await dispatch(resetAnalyticsActionStart())
    await dispatch(setAnalyticsTotalTimeStart())
    dispatch(dispatchGetAppointment(appointmentID))
  }
}

const dispatchStartCancelAppointment = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_START_CANCEL_APPOINTMENT',
    payload: {},
  }
}

const dispatchFinishCancelAppointment = (appointmentID?: string, error?: Error): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_CANCEL_APPOINTMENT',
    payload: {
      appointmentID,
      error,
    },
  }
}

/**
 * Redux action to cancel appointment associated with the given cancelID
 */
export const cancelAppointment = (cancelID?: string, appointmentID?: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(cancelAppointment(cancelID, appointmentID))))
    dispatch(dispatchStartCancelAppointment())

    try {
      await api.put('/v0/appointments/cancel/' + cancelID)
      await registerReviewEvent()
      dispatch(dispatchFinishCancelAppointment(appointmentID))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishCancelAppointment(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

const dispatchClearAppointmentCancellation = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_CLEAR_APPOINTMENT_CANCELLATION',
    payload: {},
  }
}

/**
 * Redux action to reset appointment cancellation state
 */
export const clearAppointmentCancellation = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearAppointmentCancellation())
  }
}

export const dispatchClearLoadedAppointments = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_CLEAR_LOADED_APPOINTMENTS',
    payload: {},
  }
}
