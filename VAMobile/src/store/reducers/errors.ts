import { CommonErrorTypes } from 'constants/errors'
import createReducer from './createReducer'

export type ErrorsState = {
  wasError: boolean
  errorType?: CommonErrorTypes
}

export const initialErrorsState: ErrorsState = {
  wasError: false,
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
})
