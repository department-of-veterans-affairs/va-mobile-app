import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for MILITARY_SERVICE_START_GET_HISTORY action
 */
export type MilitaryServiceStartGetHistoryPayload = {}

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
}
