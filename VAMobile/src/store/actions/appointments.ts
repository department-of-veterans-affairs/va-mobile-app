import * as api from 'store/api'
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
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchAppointments(upcoming, past, screenID))))
    dispatch(dispatchStartPrefetchAppointments())

    try {
      const upcomingAppointments = await api.get<AppointmentsGetData>('/v0/appointments', { startDate: upcoming.startDate, endDate: upcoming.endDate } as Params)
      const pastAppointments = await api.get<AppointmentsGetData>('/v0/appointments', { startDate: past.startDate, endDate: past.endDate } as Params)

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
