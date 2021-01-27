import { CommonErrorTypes } from 'constants/errors'
import createReducer from './createReducer'

export type ErrorsState = {
  wasError: boolean
  errorType?: CommonErrorTypes
  lastAction: () => Promise<void>
}

export const initialErrorsState: ErrorsState = {
  wasError: false,
  lastAction: () => Promise.resolve(),
}

export default createReducer<ErrorsState>(initialErrorsState, {
  ERRORS_SET_ERROR: (state, { errorType }) => {
    return {
      ...state,
      errorType,
      wasError: true,
    }
  },
  ERRORS_CLEAR_ERRORS: (_state, _payload) => {
    return {
      ...initialErrorsState,
    }
  },
  ERRORS_SET_TRY_AGAIN_ACTION: (state, { action }) => {
    return {
      ...initialErrorsState,
      lastAction: action,
    }
  },
})
