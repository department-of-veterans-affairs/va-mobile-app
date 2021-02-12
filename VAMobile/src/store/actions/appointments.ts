import * as api from 'store/api'
import { AppointmentStatusConstants, AppointmentTimeZone, AppointmentTypeConstants, AppointmentsErrorServiceTypesConstants } from 'store/api'
import { AppointmentsGetData, AppointmentsList, AppointmentsMetaError, Params, ScreenIDTypes } from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

export enum TimeFrameType {
  PAST,
  UPCOMING,
}

const dispatchStartGetAppointmentsInDateRange = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {},
  }
}

const dispatchFinishGetAppointmentsInDateRange = (
  appointmentsList?: AppointmentsList,
  appointmentsMetaErrors?: Array<AppointmentsMetaError>,
  timeFrame?: TimeFrameType,
  error?: Error,
): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {
      appointmentsList,
      appointmentsMetaErrors,
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

/**
 * Redux action to prefetch appointments for upcoming and past the given their date ranges
 */
export const prefetchAppointments = (upcoming: AppointmentsDateRange, past: AppointmentsDateRange, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchAppointments(upcoming, past, screenID))))
    dispatch(dispatchStartPrefetchAppointments())

    try {
      let upcomingAppointments
      const pastAppointments = await api.get<AppointmentsGetData>('/v0/appointments', { startDate: past.startDate, endDate: past.endDate } as Params)

      // TODO: delete in story #19175
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      if (signInEmail === 'vets.gov.user+1401@gmail.com') {
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
        upcomingAppointments = await api.get<AppointmentsGetData>('/v0/appointments', { startDate: upcoming.startDate, endDate: upcoming.endDate } as Params)
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
export const getAppointmentsInDateRange = (startDate: string, endDate: string, timeFrame: TimeFrameType, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppointmentsInDateRange(startDate, endDate, timeFrame, screenID))))
    dispatch(dispatchStartGetAppointmentsInDateRange())

    try {
      const appointmentsList = await api.get<AppointmentsGetData>('/v0/appointments', { startDate, endDate } as Params)
      dispatch(dispatchFinishGetAppointmentsInDateRange(appointmentsList?.data || [], appointmentsList?.meta?.errors, timeFrame))
    } catch (error) {
      dispatch(dispatchFinishGetAppointmentsInDateRange(undefined, undefined, undefined, error))
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
