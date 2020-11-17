import { AppointmentsList } from 'store/api'
import createReducer from './createReducer'

export type AppointmentsState = {
  loading: boolean
  error?: Error
  appointmentsList?: AppointmentsList
}

export const initialAppointmentsState: AppointmentsState = {
  loading: false,
  appointmentsList: [] as AppointmentsList,
}

export default createReducer<AppointmentsState>(initialAppointmentsState, {
  APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE: (state, { appointmentsList, error }) => {
    return {
      ...state,
      appointmentsList,
      error,
      loading: false,
    }
  },
})
