import * as api from '../api'
import { AType, ActionBase } from './index'

/**
 * Redux payload for {@link MilitaryServiceStartGetHistoryAction} action
 */
export type MilitaryServiceStartGetHistoryPayload = {}

/**
 * Redux action to signify the initial start of getting service history
 */
export type MilitaryServiceStartGetHistoryAction = ActionBase<'MILITARY_SERVICE_START_GET_HISTORY', MilitaryServiceStartGetHistoryPayload>

/**
 *  Redux payload for {@link MilitaryServiceFinishGetHistoryAction} action
 */
export type ServiceHistoryPayload = {
  serviceHistory?: api.ServiceHistoryData
  error?: Error
}

/**
 * Redux action to signify that military history is being retrieved
 */
export type MilitaryServiceFinishGetHistoryAction = ActionBase<'MILITARY_SERVICE_FINISH_GET_HISTORY', ServiceHistoryPayload>

/**
 *  All military service actions
 */
export type MilitaryServiceActions = AType<MilitaryServiceStartGetHistoryAction> | AType<MilitaryServiceFinishGetHistoryAction>
