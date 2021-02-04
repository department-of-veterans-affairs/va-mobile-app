import * as api from '../api'
import { ActionDef } from './index'
import { AppealData, ClaimData } from '../api'
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
  claimsAndAppealsMetaErrors?: Array<api.ClaimsAndAppealsGetDataMetaError>
  error?: Error
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED action
 */
export type ClaimsAndAppealsGetActiveOrClosed = {
  claimType: ClaimType
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_START_GET_ClAIM action
 */
export type ClaimsAndAppealsStartGetClaim = {}

/**
 * Redux payload for CLAIMS_AND_APPEALS_FINISH_GET_ClAIM action
 */
export type ClaimsAndAppealsFinishGetClaim = {
  claim?: ClaimData
  error?: Error
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_START_GET_APPEAL action
 */
export type ClaimsAndAppealsStartGetAppeal = {}

/**
 * Redux payload for CLAIMS_AND_APPEALS_FINISH_GET_APPEAL action
 */
export type ClaimsAndAppealsFinishGetAppeal = {
  appeal?: AppealData
  error?: Error
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION action
 */
export type ClaimsAndAppealsStartSubmitClaimDecision = {}

/**
 * Redux payload for CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION action
 */
export type ClaimsAndAppealsFinishSubmitClaimDecision = {
  error?: Error
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_START_FILE_UPLOAD action
 */
export type ClaimsAndAppealsStartFileUpload = {}

/**
 * Redux payload for CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD action
 */
export type ClaimsAndAppealsFinishFileUpload = {
  error?: Error
}

/**
 * Redux payload for CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS action
 */
export type ClaimsAndAppealsFileUploadSuccess = {}

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
  /** Redux action to signify the get single claim request has started */
  CLAIMS_AND_APPEALS_START_GET_ClAIM: ActionDef<'CLAIMS_AND_APPEALS_START_GET_ClAIM', ClaimsAndAppealsStartGetClaim>
  /** Redux action to signify the get single claim request has finished */
  CLAIMS_AND_APPEALS_FINISH_GET_ClAIM: ActionDef<'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM', ClaimsAndAppealsFinishGetClaim>
  /** Redux action to signify the get single appeal request has started */
  CLAIMS_AND_APPEALS_START_GET_APPEAL: ActionDef<'CLAIMS_AND_APPEALS_START_GET_APPEAL', ClaimsAndAppealsStartGetAppeal>
  /** Redux action to signify the get single appeal request has finished */
  CLAIMS_AND_APPEALS_FINISH_GET_APPEAL: ActionDef<'CLAIMS_AND_APPEALS_FINISH_GET_APPEAL', ClaimsAndAppealsFinishGetAppeal>
  /** Redux action to signify the request to submit a claim decision has started */
  CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION: ActionDef<'CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION', ClaimsAndAppealsStartSubmitClaimDecision>
  /** Redux action to signify the request to submit a claim decision has finished */
  CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION: ActionDef<'CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION', ClaimsAndAppealsFinishSubmitClaimDecision>
  /** Redux action to signify the request to upload a file has started */
  CLAIMS_AND_APPEALS_START_FILE_UPLOAD: ActionDef<'CLAIMS_AND_APPEALS_START_FILE_UPLOAD', ClaimsAndAppealsStartFileUpload>
  /** Redux action to signify the request to upload a file has finished */
  CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD: ActionDef<'CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD', ClaimsAndAppealsFinishFileUpload>
  /** Redux action to signify the request to upload a file was successful */
  CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS: ActionDef<'CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS', ClaimsAndAppealsFileUploadSuccess>
}
