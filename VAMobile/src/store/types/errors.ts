import { ActionDef } from './index'
import { CommonErrorTypes } from 'constants/errors'
import { ScreenIDTypes } from '../api'

export type ErrorsSetErrorPayload = {
  errorType?: CommonErrorTypes
  screenID?: ScreenIDTypes
}

export type ErrorsClearErrorsPayload = {
  screenID?: ScreenIDTypes
}

export type ErrorsSetMetadataPayload = {
  metadata?: {
    [key: string]: string
  }
  screenID?: ScreenIDTypes
}

export type ErrorsClearMetadataPayload = {
  screenID?: ScreenIDTypes
}

export type ErrorsSetTryAgainFunctionPayload = {
  tryAgain: () => Promise<void>
}

/**
 *  All errors actions
 */
export interface ErrorsActions {
  /** Redux action to signify that set error request has started */
  ERRORS_SET_ERROR: ActionDef<'ERRORS_SET_ERROR', ErrorsSetErrorPayload>
  /** Redux action to signify that clear errors request has started */
  ERRORS_CLEAR_ERRORS: ActionDef<'ERRORS_CLEAR_ERRORS', ErrorsClearErrorsPayload>
  /** Redux action to signify that set error metadata request has started */
  ERRORS_SET_METADATA: ActionDef<'ERRORS_SET_METADATA', ErrorsSetMetadataPayload>
  /** Redux action to signify that clear error metadata request has started */
  ERRORS_CLEAR_METADATA: ActionDef<'ERRORS_CLEAR_METADATA', ErrorsClearMetadataPayload>
  /** Redux action to signify that clear all error metadata request has started */
  ERRORS_CLEAR_ALL_METADATA: ActionDef<'ERRORS_CLEAR_ALL_METADATA', null>
  /** Redux action to signify that errors set try again request has started */
  ERRORS_SET_TRY_AGAIN_FUNCTION: ActionDef<'ERRORS_SET_TRY_AGAIN_FUNCTION', ErrorsSetTryAgainFunctionPayload>
}
