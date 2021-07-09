import { DateTime } from 'luxon'
import createReducer from './createReducer'

export type AnalyticsState = {
  loginTimestamp: number
  totalTimeStart: number
  actionStart: number
}

export const initialAnalyticsState: AnalyticsState = {
  loginTimestamp: -1,
  totalTimeStart: -1,
  actionStart: -1,
}

export default createReducer<AnalyticsState>(initialAnalyticsState, {
  ANALYTICS_SET_LOGIN_TIME: (state, payload) => {
    return {
      ...state,
      ...payload,
      loginTimestamp: DateTime.now().millisecond,
    }
  },
})
