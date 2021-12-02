import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux paylod for starting loading vaccines
 */
export type VaccineStartGetVaccinesPayload = Record<string, unknown>

/**
 * Redux paylod for finishing loading of vaccines
 */
export type VaccineFinishGetVaccinesPayload = {
  vaccines?: api.VaccineList
  error?: api.APIError
}

export interface VaccineActions {
  VACCINE_START_GET_VACCINES: ActionDef<'VACCINE_START_GET_VACCINES', VaccineStartGetVaccinesPayload>
  VACCINE_FINISH_GET_VACCINES: ActionDef<'VACCINE_FINISH_GET_VACCINES', VaccineFinishGetVaccinesPayload>
}
