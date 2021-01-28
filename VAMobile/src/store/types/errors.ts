import { ActionDef } from './index'
import { CommonErrorTypes } from 'constants/errors'

export type ErrorsSetErrorPayload = {
  errorType: CommonErrorTypes
  screenID?: string
}

export type ErrorsClearErrorsPayload = {}

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
  /** Redux action to signify that errors set try again request has started */
  ERRORS_SET_TRY_AGAIN_FUNCTION: ActionDef<'ERRORS_SET_TRY_AGAIN_FUNCTION', ErrorsSetTryAgainFunctionPayload>
}
