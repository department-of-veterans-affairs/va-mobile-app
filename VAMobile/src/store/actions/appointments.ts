import * as api from 'store/api'
import { AppointmentData } from 'store/api'
import { AppointmentStatusConstants, AppointmentTimeZone, AppointmentTypeConstants, AppointmentsErrorServiceTypesConstants } from 'store/api'
import { AppointmentsGetData, Params, ScreenIDTypes } from 'store/api'
import { AppointmentsMetaPagination } from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { UserAnalytics } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange } from 'utils/common'
import { isIOS } from 'utils/platform'
import { setAnalyticsUserProperty } from 'utils/analytics'

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
                startDateLocal: '2021-02-06T19:53:14.000+00:00',
                startDateUtc: '2021-02-06T19:53:14.000+00:00',
                minutesDuration: 60,
                comment: 'Please arrive 20 minutes before the start of your appointment',
                timeZone: 'America/Los_Angeles' as AppointmentTimeZone,
                healthcareService: 'Blind Rehabilitation Center',
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
          ],
          meta: {
            errors: [{ source: AppointmentsErrorServiceTypesConstants.COMMUNITY_CARE }],
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
      dispatch(dispatchFinishPrefetchAppointments(undefined, undefined, error))
      dispatch(dispatchSetError(CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD, screenID))
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
      // Gives time for upcomingAppointments component to re-render to loading screen,
      // so the iOS scrollView position will reset to top whenever user switches between pages.
      // Otherwise the scrollView stays at the bottom and makes the pagination component padding look inconsistent between pages,
      // since the appointment list sizes differ depending on content
      if (!isIOS) {
        dispatch(dispatchFinishGetAppointmentsInDateRange(timeFrame, loadedAppointments))
      } else {
        await setTimeout(() => {
          dispatch(dispatchFinishGetAppointmentsInDateRange(timeFrame, loadedAppointments))
        }, 1)
      }
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
      dispatch(dispatchFinishGetAppointmentsInDateRange(timeFrame, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
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
      dispatch(dispatchFinishCancelAppointment(appointmentID))
    } catch (error) {
      dispatch(dispatchFinishCancelAppointment(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
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
