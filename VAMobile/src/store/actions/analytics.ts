import { AsyncReduxAction, ReduxAction } from '../types'

export const ACTION_START_DEFAULT = -1

/** Dispatch Action to set current timestamp to loginTimestamp */
export const dispatchSetAnalyticsLogin = (): ReduxAction => {
  return {
    type: 'ANALYTICS_SET_LOGIN_TIME',
    payload: {},
  }
}

/** Dispatch Action to set current timestamp to totalTimerStart */
export const dispatchSetTotalTimeStart = (): ReduxAction => {
  return {
    type: 'ANALYTICS_SET_TOTAL_TIME_START',
    payload: {},
  }
}

/** Dispatch Action to set timestamp param to actionStart */
export const dispatchSetActionStart = (timestamp: number): ReduxAction => {
  return {
    type: 'ANALYTICS_SET_ACTION_START',
    payload: { actionStart: timestamp },
  }
}

/**
 * Redux function to set the loginTimestamp to the current time in milliseconds
 */
export const setAnalyticsLogin = (): AsyncReduxAction => {
  return async (dispatch) => {
    await dispatch(dispatchSetAnalyticsLogin())
  }
}

/**
 * Redux function to set the totalTimeStart to the current time in milliseconds
 */
export const setAnalyticsTotalTimeStart = (): AsyncReduxAction => {
  return async (dispatch) => {
    await dispatch(dispatchSetTotalTimeStart())
  }
}

/**
 * Redux function to set the actionStart value
 * @param timestamp- the timestamp when the action started, or ACTION_START_DEFAULT if resetting the value
 */
export const setAnalyticsActionStart = (timestamp: number): AsyncReduxAction => {
  return async (dispatch) => {
    await dispatch(dispatchSetActionStart(timestamp))
  }
}
