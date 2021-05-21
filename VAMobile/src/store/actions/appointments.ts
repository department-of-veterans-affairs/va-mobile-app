import * as api from 'store/api'
import { AppointmentData } from 'store/api'
import { AppointmentStatusConstants, AppointmentTimeZone, AppointmentTypeConstants, AppointmentsErrorServiceTypesConstants } from 'store/api'
import { AppointmentsGetData, Params, ScreenIDTypes } from 'store/api'
import { AppointmentsMetaPagination } from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { LoadedAppointments, getLoadedAppointmentsKey } from 'store/reducers'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange } from 'utils/common'

export enum TimeFrameType {
  PAST_THREE_MONTHS,
  PAST_FIVE_TO_THREE_MONTHS,
  PAST_EIGHT_TO_SIX_MONTHS,
  PAST_ELEVEN_TO_NINE_MONTHS,
  PAST_ALL_CURRENT_YEAR,
  PAST_ALL_LAST_YEAR,
  UPCOMING,
}

const dispatchStartGetAppointmentsInDateRange = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {},
  }
}

const dispatchFinishGetAppointmentsInDateRange = (appointments?: AppointmentsGetData, timeFrame?: TimeFrameType, error?: Error): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {
      appointments,
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
const getLoadedAppointments = (appointments: Array<AppointmentData>, paginationMetaData: AppointmentsMetaPagination, latestPage: number, pageSize: number) => {
  const loadedAppointments = getItemsInRange(appointments, latestPage, pageSize)
  // do we have the appointments?
  if (loadedAppointments) {
    return {
      data: loadedAppointments,
      meta: {
        pagination: {
          currentPage: latestPage,
          perPage: pageSize,
          totalEntries: paginationMetaData.totalEntries,
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
export const prefetchAppointments = (upcoming: AppointmentsDateRange, past: AppointmentsDateRange, screenID?: ScreenIDTypes, _useCache = true): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchAppointments(upcoming, past, screenID))))
    dispatch(dispatchStartPrefetchAppointments())

    // TODO: Use the cache when it is available
    // const useCacheParam = useCache ? 'true' : 'false'
    const useCacheParam = 'false'

    const { upcoming: loadedUpcoming, pastThreeMonths: loadedPastThreeMonths } = getState().appointments.loadedAppointments
    const { upcoming: upcomingMetaPagination, pastThreeMonths: pastMetaPagination } = getState().appointments.loadedAppointmentsMetaPagination
    try {
      let upcomingAppointments
      let pastAppointments

      // use loaded data if we have it
      const loadedPastAppointments = getLoadedAppointments(loadedPastThreeMonths, pastMetaPagination, 1, DEFAULT_PAGE_SIZE)
      if (loadedPastAppointments) {
        pastAppointments = loadedPastAppointments
      } else {
        pastAppointments = await api.get<AppointmentsGetData>('/v0/appointments', {
          startDate: past.startDate,
          endDate: past.endDate,
          useCache: useCacheParam,
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          'page[number]': '1', // prefetch assume always first page
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
        const loadedUpcomingAppointments = getLoadedAppointments(loadedUpcoming, upcomingMetaPagination, 1, DEFAULT_PAGE_SIZE)
        if (loadedUpcomingAppointments) {
          upcomingAppointments = loadedUpcomingAppointments
        } else {
          upcomingAppointments = await api.get<AppointmentsGetData>('/v0/appointments', {
            startDate: upcoming.startDate,
            endDate: upcoming.endDate,
            useCache: useCacheParam,
            'page[size]': DEFAULT_PAGE_SIZE.toString(),
            'page[number]': '1', // prefetch assume always first page
          } as Params)
        }
      }

      dispatch(dispatchFinishPrefetchAppointments(upcomingAppointments, pastAppointments))
    } catch (error) {
      dispatch(dispatchFinishPrefetchAppointments(undefined, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

/**
 * Redux action to get all appointments in the given date range
 */
export const getAppointmentsInDateRange = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  page: number,
  screenID?: ScreenIDTypes,
  _useCache = true,
): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppointmentsInDateRange(startDate, endDate, timeFrame, page, screenID))))
    dispatch(dispatchStartGetAppointmentsInDateRange())

    const appointmentsState = getState().appointments
    // get stored list of appointments based on timeFrame
    const loadedAppointmentKey = getLoadedAppointmentsKey(timeFrame) as keyof LoadedAppointments
    const appointments = appointmentsState.loadedAppointments[loadedAppointmentKey] as Array<AppointmentData>
    const appointmentsMetaPagination = appointmentsState.loadedAppointmentsMetaPagination[loadedAppointmentKey]

    // return loaded data if we have it
    const loadedAppointments = getLoadedAppointments(appointments, appointmentsMetaPagination, page, DEFAULT_PAGE_SIZE)
    if (loadedAppointments) {
      dispatch(dispatchFinishGetAppointmentsInDateRange(loadedAppointments, timeFrame))
      return
    }

    // TODO: Use the cache when it is available
    // const useCacheParam = useCache ? 'true' : 'false'
    const useCacheParam = 'false'

    try {
      const appointmentsList = await api.get<AppointmentsGetData>('/v0/appointments', {
        startDate,
        endDate,
        useCache: useCacheParam,
        'page[number]': page.toString(),
        'page[size]': DEFAULT_PAGE_SIZE.toString(),
      } as Params)
      dispatch(dispatchFinishGetAppointmentsInDateRange(appointmentsList, timeFrame))
    } catch (error) {
      dispatch(dispatchFinishGetAppointmentsInDateRange(undefined, undefined, error))
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
