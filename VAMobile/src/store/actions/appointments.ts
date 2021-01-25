import * as api from 'store/api'
import { AppointmentsGetData, AppointmentsList, Params } from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'

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

const dispatchFinishGetAppointmentsInDateRange = (appointmentsList?: AppointmentsList, timeFrame?: TimeFrameType, error?: Error): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {
      appointmentsList,
      error,
      timeFrame,
    },
  }
}

/**
 * Redux action to get all appointments in the given date range
 */
export const getAppointmentsInDateRange = (startDate: string, endDate: string, timeFrame: TimeFrameType): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartGetAppointmentsInDateRange())

    try {
      const appointmentsList = await api.get<AppointmentsGetData>('/v0/appointments', { startDate, endDate } as Params)
      dispatch(dispatchFinishGetAppointmentsInDateRange(appointmentsList?.data || [], timeFrame))
    } catch (error) {
      dispatch(dispatchFinishGetAppointmentsInDateRange(undefined, undefined, error))
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
