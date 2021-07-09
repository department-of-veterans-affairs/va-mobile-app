import { DateTime } from 'luxon'
import createReducer from './createReducer'

/** type denoting Analytics state values */
export type AnalyticsState = {
  loginTimestamp: number
  totalTimeStart: number
  actionStart: number
}

/** initial values for analyticsState */
export const initialAnalyticsState: AnalyticsState = {
  loginTimestamp: -1,
  totalTimeStart: -1,
  actionStart: -1,
}

/** reducers function for analytics actions */
export default createReducer<AnalyticsState>(initialAnalyticsState, {
  ANALYTICS_SET_LOGIN_TIME: (state, payload) => {
    const now = DateTime.now().millisecond
    return {
      ...state,
      ...payload,
      loginTimestamp: now,
      totalTimeStart: now,
    }
  },
  ANALYTICS_SET_TOTAL_TIME_START: (state, payload) => {
    return {
      ...state,
      ...payload,
      totalTimeStart: DateTime.now().millisecond,
    }
  },
  ANALYTICS_SET_ACTION_START: (state, { actionStart }) => {
    return {
      ...state,
      actionStart: actionStart,
    }
  },
})
