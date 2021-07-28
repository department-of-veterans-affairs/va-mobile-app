import { ActionDef } from './index'

export type AnalyticsSetLoginTimePayload = Record<string, unknown>

export type AnalyticsSetTotalTimeStart = Record<string, unknown>

export type AnalyticsSetActionStart = {
  actionStart: number
}

export interface AnalyticsActions {
  /** Redux action to set the login timestamp */
  ANALYTICS_SET_LOGIN_TIME: ActionDef<'ANALYTICS_SET_LOGIN_TIME', AnalyticsSetLoginTimePayload>
  /** Redux action to set the totalTimeStart timestamp */
  ANALYTICS_SET_TOTAL_TIME_START: ActionDef<'ANALYTICS_SET_TOTAL_TIME_START', AnalyticsSetTotalTimeStart>
  /** Redux action to set the actionStart timestamp */
  ANALYTICS_SET_ACTION_START: ActionDef<'ANALYTICS_SET_ACTION_START', AnalyticsSetActionStart>
}
