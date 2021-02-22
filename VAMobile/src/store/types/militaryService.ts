import * as api from '../api'
import { ActionDef, EmptyPayload } from './index'

/**
 * Redux payload for MILITARY_SERVICE_START_GET_HISTORY action
 */
export type MilitaryServiceStartGetHistoryPayload = Record<string, unknown>

/**
 *  Redux payload for MILITARY_SERVICE_FINISH_GET_HISTORY action
 */
export type ServiceHistoryPayload = {
  serviceHistory?: api.ServiceHistoryData
  error?: Error
}

/**
 *  All military service actions
 */
export interface MilitaryServiceActions {
  /** Redux action to signify the initial start of getting service history */
  MILITARY_SERVICE_START_GET_HISTORY: ActionDef<'MILITARY_SERVICE_START_GET_HISTORY', MilitaryServiceStartGetHistoryPayload>
  /** Redux action to signify that military history is being retrieved */
  MILITARY_SERVICE_FINISH_GET_HISTORY: ActionDef<'MILITARY_SERVICE_FINISH_GET_HISTORY', ServiceHistoryPayload>
  /** Redux action to clear military service data on logout **/
  MILITARY_SERVICE_ON_LOGOUT: ActionDef<'MILITARY_SERVICE_ON_LOGOUT', EmptyPayload>
}
