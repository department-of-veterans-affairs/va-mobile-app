import { CommonErrorTypes } from 'constants/errors'
import { ReduxAction } from '../types'
import { ScreenIDTypes } from '../api'

export const dispatchSetError = (errorType?: CommonErrorTypes, screenID?: ScreenIDTypes, messageID?: number): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
      screenID,
      messageID,
    },
  }
}

export const dispatchClearErrors = (): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ERRORS',
    payload: {},
  }
}

export const dispatchSetTryAgainFunction = (tryAgain: () => Promise<void>): ReduxAction => {
  return {
    type: 'ERRORS_SET_TRY_AGAIN_FUNCTION',
    payload: {
      tryAgain,
    },
  }
}
