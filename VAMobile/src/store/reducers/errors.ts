import { CommonErrorTypes } from 'constants/errors'
import { ScreenIDTypes } from '../api'
import createReducer from './createReducer'

export type ErrorsState = {
  screenID?: ScreenIDTypes
  errorType?: CommonErrorTypes
  messageID?: number
  tryAgain: () => Promise<void>
}

export const initialErrorsState: ErrorsState = {
  screenID: undefined,
  messageID: undefined,
  tryAgain: () => Promise.resolve(),
}

export default createReducer<ErrorsState>(initialErrorsState, {
  ERRORS_SET_ERROR: (state, { errorType, screenID, messageID }) => {
    return {
      ...state,
      errorType,
      screenID,
      messageID,
    }
  },
  ERRORS_CLEAR_ERRORS: (_state, _payload) => {
    return {
      ...initialErrorsState,
    }
  },
  ERRORS_SET_TRY_AGAIN_FUNCTION: (state, { tryAgain }) => {
    return {
      ...initialErrorsState,
      tryAgain,
    }
  },
})
