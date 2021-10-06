import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux paylod for starting loading immunizations
 */
export type ImmunizationStartGetImmunizationsPayload = Record<string, unknown>

/**
 * Redux paylod for finishing loading of immunizations
 */
export type ImmunizationFinishGetImmunizationsPayload = {
  immunizations?: api.ImmunizationList
  error?: api.APIError
}

export interface ImmunizationActions {
  IMMUNIZATION_START_GET_IMMUNIZATIONS: ActionDef<'IMMUNIZATION_START_GET_IMMUNIZATIONS', ImmunizationStartGetImmunizationsPayload>
  IMMUNIZATION_FINISH_GET_IMMUNIZATIONS: ActionDef<'IMMUNIZATION_FINISH_GET_IMMUNIZATIONS', ImmunizationFinishGetImmunizationsPayload>
}
