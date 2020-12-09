import * as api from '../api'
import { ActionDef } from './index'
import { ClaimType } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'

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
 * Redux payload for CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED action
 */
export type ClaimsAndAppealsGetActiveOrClosed = {
  claimType: ClaimType
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_GET_ClAIM_OR_APPEAL action
 */
export type ClaimsAndAppealsGetClaimOrAppeal = {
  id: string
}

/**
 *  All claims and appeals actions
 */
export interface ClaimsAndAppealsActions {
  /** Redux action to signify that the get claims and appeals request has started */
  CLAIMS_AND_APPEALS_START_GET_ALL: ActionDef<'CLAIMS_AND_APPEALS_START_GET_ALL', ClaimsAndAppealsStartGetAllPayload>
  /** Redux action to signify that the get claims and appeals request has finished */
  CLAIMS_AND_APPEALS_FINISH_GET_ALL: ActionDef<'CLAIMS_AND_APPEALS_FINISH_GET_ALL', ClaimsAndAppealsFinishGetAllPayload>
  /** Redux action to signify the get active or closed claims and appeals request */
  CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED: ActionDef<'CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED', ClaimsAndAppealsGetActiveOrClosed>
  /** Redux action to signify the get single claim or appeal request */
  CLAIMS_AND_APPEALS_GET_ClAIM_OR_APPEAL: ActionDef<'CLAIMS_AND_APPEALS_GET_ClAIM_OR_APPEAL', ClaimsAndAppealsGetClaimOrAppeal>
}
