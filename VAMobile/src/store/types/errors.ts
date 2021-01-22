import { ActionDef } from './index'
import { CommonErrorTypes } from 'constants/errors'

export type ErrorsSetErrorPayload = {
  errorType: CommonErrorTypes
  bool: boolean
  wasError: boolean
}

export type ErrorsClearErrorsPayload = {}

/**
 *  All errors actions
 */
export interface ErrorsActions {
  /** Redux action to signify that set error request has started */
  ERRORS_SET_ERROR: ActionDef<'ERRORS_SET_ERROR', ErrorsSetErrorPayload>
  /** Redux action to signify that clear errors request has started */
  ERRORS_CLEAR_ERRORS: ActionDef<'ERRORS_CLEAR_ERRORS', ErrorsClearErrorsPayload>
}
