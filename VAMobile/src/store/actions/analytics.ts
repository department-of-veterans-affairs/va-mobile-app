import { ReduxAction } from '../types'

export const dispatchSetAnalyticsLogin = (): ReduxAction => {
  return {
    type: 'ANALYTICS_SET_LOGIN_TIME',
    payload: {},
  }
}
