import { ActionDef } from './index'
import { CommonErrorTypes } from 'constants/errors'
import { DowntimeWindowsByScreenIDType, ErrorsByScreenIDType } from 'store'
import { ScreenIDTypes } from '../api'

export type ErrorsSetErrorPayload = {
  errorType?: CommonErrorTypes
  screenID?: ScreenIDTypes
}

export type ErrorsSetErrorsPayload = {
  errors: ErrorsByScreenIDType
}

export type ErrorsClearErrorsPayload = {
  screenID?: ScreenIDTypes
}

export type ErrorsSetDowntimePayload = {
  downtimeWindows: DowntimeWindowsByScreenIDType
}

export type ErrorsClearDowntimePayload = {
  screenID?: ScreenIDTypes
}

export type ErrorClearErrorTypePayload = {
  errorType: CommonErrorTypes
}

export type ErrorsSetTryAgainFunctionPayload = {
  tryAgain: () => Promise<void>
}

export type ErrorClearErrorTypeByScreenPayload = {
  errorType: CommonErrorTypes
  screenID: ScreenIDTypes
}

/**
 *  All errors actions
 */
export interface ErrorsActions {
  /** Redux action to signify that set error request has started */
  ERRORS_SET_ERROR: ActionDef<'ERRORS_SET_ERROR', ErrorsSetErrorPayload>
  /** Redux action to signify that set errors request has started */
  ERRORS_SET_ERRORS: ActionDef<'ERRORS_SET_ERRORS', ErrorsSetErrorsPayload>
  /** Redux action to signify that clear errors request has started */
  ERRORS_CLEAR_ERRORS: ActionDef<'ERRORS_CLEAR_ERRORS', ErrorsClearErrorsPayload>
  /** Redux action to signify that set error metadata request has started */
  ERRORS_SET_DOWNTIME: ActionDef<'ERRORS_SET_DOWNTIME', ErrorsSetDowntimePayload>
  /** Redux action to signify that clear error metadata request has started */
  ERRORS_CLEAR_DOWNTIME: ActionDef<'ERRORS_CLEAR_DOWNTIME', ErrorsClearDowntimePayload>
  /** Redux action to signify that clear all error metadata request has started */
  ERRORS_CLEAR_ALL_DOWNTIME: ActionDef<'ERRORS_CLEAR_ALL_DOWNTIME', null>
  /** Redux action to signify that clear error type request has started */
  ERRORS_CLEAR_ERROR_TYPE: ActionDef<'ERRORS_CLEAR_ERROR_TYPE', ErrorClearErrorTypePayload>
  /** Redux action to signify that clear error type by screenID request has started */
  ERRORS_CLEAR_ERROR_TYPE_BY_SCREEN: ActionDef<'ERRORS_CLEAR_ERROR_TYPE_BY_SCREEN', ErrorClearErrorTypeByScreenPayload>
  /** Redux action to signify that errors set try again request has started */
  ERRORS_SET_TRY_AGAIN_FUNCTION: ActionDef<'ERRORS_SET_TRY_AGAIN_FUNCTION', ErrorsSetTryAgainFunctionPayload>
}
