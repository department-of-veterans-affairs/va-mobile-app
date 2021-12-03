import * as api from '../api'
import { ActionDef } from './index'
import { TimeFrameType } from 'constants/appointments'

/**
 * Redux payload for APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE action
 */
export type AppointmentsStartGetAppointmentsInDateRangePayload = Record<string, unknown>

/**
 * Redux payload for APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE action
 */
export type AppointmentsFinishGetAppointmentsInDateRangePayload = {
  appointments: api.AppointmentsGetData
  timeFrame: TimeFrameType
  error?: Error
}

/**
 * Redux payload for APPOINTMENTS_GET_APPOINTMENT action
 */
export type AppointmentsGetAppointmentPayload = {
  appointmentID: string
}

/**
 * Redux payload for APPOINTMENTS_START_PREFETCH_APPOINTMENTS action
 */
export type AppointmentsStartPrefetchAppointmentsPayload = Record<string, unknown>

/**
 * Redux payload for APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS action
 */
export type AppointmentsFinishPrefetchAppointmentsPayload = {
  upcoming?: api.AppointmentsGetData
  past?: api.AppointmentsGetData
  appointmentsMetaErrors?: Array<api.AppointmentsMetaError>
  error?: Error
}

export type AppointmentsNotificationPayload = {
  appointmentNotification: boolean
}

/**
 * Redux payload for APPOINTMENTS_START_CANCEL_APPOINTMENT action
 */
export type AppointmentsStartCancelAppointment = Record<string, unknown>

/**
 * Redux payload for APPOINTMENTS_FINISH_CANCEL_APPOINTMENT action
 */
export type AppointmentsFinishCancelAppointment = {
  appointmentID?: string
  error?: Error
}

/**
 * Redux payload for APPOINTMENTS_CLEAR_APPOINTMENT_CANCELLATION action
 */
export type AppointmentsClearAppointmentCancellation = Record<string, unknown>

/**
 * Redux payload for APPOINTMENTS_CLEAR_LOADED_APPOINTMENTS action
 */
export type AppointmentsClearLoadedAppointmentsPayload = Record<string, unknown>

/**
 *  All appointments actions
 */
export interface AppointmentsActions {
  /** Redux action to signify that the get appointments request has started */
  APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE: ActionDef<'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE', AppointmentsStartGetAppointmentsInDateRangePayload>
  /** Redux action to signify that the get appointments request has finished */
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: ActionDef<'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE', AppointmentsFinishGetAppointmentsInDateRangePayload>
  /** Redux action to signify the get appointment request */
  APPOINTMENTS_GET_APPOINTMENT: ActionDef<'APPOINTMENTS_GET_APPOINTMENT', AppointmentsGetAppointmentPayload>
  /** Redux action to signify that the prefetch appointments request has started */
  APPOINTMENTS_START_PREFETCH_APPOINTMENTS: ActionDef<'APPOINTMENTS_START_PREFETCH_APPOINTMENTS', AppointmentsStartPrefetchAppointmentsPayload>
  /** Redux action to signify that the prefetch appointments request has finished */
  APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS: ActionDef<'APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS', AppointmentsFinishPrefetchAppointmentsPayload>
  /** Redux action to signify that the cancel appointment request has started */
  APPOINTMENTS_START_CANCEL_APPOINTMENT: ActionDef<'APPOINTMENTS_START_CANCEL_APPOINTMENT', AppointmentsStartCancelAppointment>
  /** Redux action to signify that the cancel appointment request has started */
  APPOINTMENTS_FINISH_CANCEL_APPOINTMENT: ActionDef<'APPOINTMENTS_FINISH_CANCEL_APPOINTMENT', AppointmentsFinishCancelAppointment>
  /** Redux action to signify that the clear appointment cancellation has started */
  APPOINTMENTS_CLEAR_APPOINTMENT_CANCELLATION: ActionDef<'APPOINTMENTS_CLEAR_APPOINTMENT_CANCELLATION', AppointmentsClearAppointmentCancellation>
  /** Redux action to signify clearing loaded appointments from the store*/
  APPOINTMENTS_CLEAR_LOADED_APPOINTMENTS: ActionDef<'APPOINTMENTS_CLEAR_LOADED_APPOINTMENTS', AppointmentsClearLoadedAppointmentsPayload>
}
