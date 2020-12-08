import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for CLAIMS_AND_APPEALS_START_GET_ALL action
 */
export type ClaimsAndAppealsStartGetAllPayload = {}

/**
 * Redux payload for CLAIMS_AND_APPEALS_FINISH_GET_ALL action
 */
export type ClaimsAndAppealsFinishGetAllPayload = {
  claimsAndAppealsList?: api.ClaimsAndAppealsList
  error?: Error
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_GET_ACTIVE action
 */
export type ClaimsAndAppealsGetActive = {}

/**
 *  All claims and appeals actions
 */
export interface ClaimsAndAppealsActions {
  /** Redux action to signify that the get claims and appeals request has started */
  CLAIMS_AND_APPEALS_START_GET_ALL: ActionDef<'CLAIMS_AND_APPEALS_START_GET_ALL', ClaimsAndAppealsStartGetAllPayload>
  /** Redux action to signify that the get claims and appeals request has finished */
  CLAIMS_AND_APPEALS_FINISH_GET_ALL: ActionDef<'CLAIMS_AND_APPEALS_FINISH_GET_ALL', ClaimsAndAppealsFinishGetAllPayload>
  /** Redux action to signify the get active claims and appeals request */
  CLAIMS_AND_APPEALS_GET_ACTIVE: ActionDef<'CLAIMS_AND_APPEALS_GET_ACTIVE', ClaimsAndAppealsGetActive>
}
