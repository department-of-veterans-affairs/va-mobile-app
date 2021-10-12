import { ActionDef } from './index'
import { HealthData } from '../api/types'

/**
 * Redux payload for HEALTH_UPDATE action
 */
export type HealthUpdatePayload = {
  health?: HealthData
  error?: Error
}

/**
 * Redux payload for HEALTH_CLEAR action
 */
export type HealthClearPayload = Record<string, unknown>

export interface HealthActions {
  /** Redux action to update health data from user data */
  HEALTH_UPDATE: ActionDef<'HEALTH_UPDATE', HealthUpdatePayload>
  /** Redux action to clear health data after logout */
  HEALTH_CLEAR: ActionDef<'HEALTH_CLEAR', HealthClearPayload>
}
