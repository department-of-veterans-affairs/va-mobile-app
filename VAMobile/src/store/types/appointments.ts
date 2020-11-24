import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE action
 */
export type AppointmentsStartGetAppointmentsInDateRangePayload = {}

/**
 * Redux payload for APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE action
 */
export type AppointmentsFinishGetAppointmentsInDateRangePayload = {
  appointmentsList?: api.AppointmentsList
  error?: Error
}

/**
 * Redux payload for APPOINTMENTS_GET_APPOINTMENT action
 */
export type AppointmentsGetAppointmentPayload = {
  appointmentID: string
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
}
