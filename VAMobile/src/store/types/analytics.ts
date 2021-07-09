import { ActionDef } from './index'

export type AnalyticsSetLoginTimePayload = Record<string, unknown>

export interface AnalyticsActions {
  /** Redux action to set the login timestamp */
  ANALYTICS_SET_LOGIN_TIME: ActionDef<'ANALYTICS_SET_LOGIN_TIME', AnalyticsSetLoginTimePayload>
}
