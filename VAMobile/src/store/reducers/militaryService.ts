import * as api from 'store/api'
import { MilitaryServiceStartGetHistoryPayload, ServiceHistoryPayload } from '../types'
import createReducer from './createReducer'

export type MilitaryServiceState = {
  serviceHistory: api.ServiceHistoryData
  loading: boolean
  error?: Error
}

export const initialMilitaryServiceState: MilitaryServiceState = {
  serviceHistory: [] as api.ServiceHistoryData,
  loading: false,
}

export default createReducer<MilitaryServiceState>(initialMilitaryServiceState, {
  MILITARY_SERVICE_START_GET_HISTORY: (state: MilitaryServiceState, payload: MilitaryServiceStartGetHistoryPayload): MilitaryServiceState => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  MILITARY_SERVICE_FINISH_GET_HISTORY: (state: MilitaryServiceState, { serviceHistory, error }: ServiceHistoryPayload): MilitaryServiceState => {
    return {
      ...state,
      error,
      serviceHistory: serviceHistory || state.serviceHistory,
      loading: false,
    }
  },
})
