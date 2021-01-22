import { ActionDef } from './index'
import { CommonErrorTypes } from 'store/reducers'

export type ErrorsSetErrorPayload = {
  errorType: string
  bool: boolean
}

/**
 *  All errors actions
 */
export interface ErrorsActions {
  /** Redux action to signify that set error request has started */
  ERRORS_SET_ERROR: ActionDef<'ERRORS_SET_ERROR', ErrorsSetErrorPayload>
}
