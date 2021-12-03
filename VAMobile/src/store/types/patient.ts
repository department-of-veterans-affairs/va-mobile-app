import { ActionDef } from './index'
import { CernerData } from '../api/types'

/**
 * Redux payload for CERNER_UPDATE action
 */
export type HealthUpdatePayload = {
  cerner?: CernerData
  error?: Error
}

/**
 * Redux payload for CERNER_CLEAR action
 */
export type CernerClearPayload = Record<string, unknown>

export interface PatientActions {
  /** Redux action to update cerner data from user data */
  CERNER_UPDATE: ActionDef<'CERNER_UPDATE', HealthUpdatePayload>
  /** Redux action to clear cerner data after logout */
  CERNER_CLEAR: ActionDef<'CERNER_CLEAR', CernerClearPayload>
}
