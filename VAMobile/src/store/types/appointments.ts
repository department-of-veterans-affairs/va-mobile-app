import * as api from '../api'
import { ActionDef } from './index'
import { TimeFrameType } from 'store/actions'

/**
 * Redux payload for APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE action
 */
export type AppointmentsStartGetAppointmentsInDateRangePayload = {}

/**
 * Redux payload for APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE action
 */
export type AppointmentsFinishGetAppointmentsInDateRangePayload = {
  appointmentsList?: api.AppointmentsList
  timeFrame?: TimeFrameType
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
export type AppointmentsStartPrefetchAppointmentsPayload = {}

/**
 * Redux payload for APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS action
 */
export type AppointmentsFinishPrefetchAppointmentsPayload = {
  upcoming?: api.AppointmentsList
  past?: api.AppointmentsList
  error?: Error
}

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
}
