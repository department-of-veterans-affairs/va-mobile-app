import * as api from 'store/api'
import { ServiceData } from 'store/api'
import { getDateFromString } from 'utils/formattingUtils'
import { max } from 'underscore'
import createReducer from './createReducer'

export type MilitaryServiceState = {
  serviceHistory: api.ServiceHistoryData
  loading: boolean
  error?: Error
  mostRecentBranch?: string
  needsUpdate?: boolean
}

export const initialMilitaryServiceState: MilitaryServiceState = {
  serviceHistory: [] as api.ServiceHistoryData,
  loading: false,
}

export default createReducer<MilitaryServiceState>(initialMilitaryServiceState, {
  MILITARY_SERVICE_START_GET_HISTORY: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  MILITARY_SERVICE_FINISH_GET_HISTORY: (state, { serviceHistory, error }) => {
    const history = serviceHistory || state.serviceHistory

    const latestHistory = max(history, (historyItem) => {
      return getDateFromString(historyItem.endDate)
    }) as ServiceData

    return {
      ...state,
      error,
      mostRecentBranch: latestHistory?.branchOfService,
      serviceHistory: history,
      loading: false,
    }
  },
})
