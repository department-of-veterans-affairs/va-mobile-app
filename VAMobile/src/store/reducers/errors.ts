import createReducer from './createReducer'

export type ErrorsState = {
  wasError: boolean
  networkConnectionError: boolean
}

export const initialErrorsState: ErrorsState = {
  wasError: false,
  networkConnectionError: false,
}

export default createReducer<ErrorsState>(initialErrorsState, {
  ERRORS_SET_ERROR: (state, { errorType, bool, wasError }) => {
    return {
      ...state,
      wasError,
      [errorType]: bool,
    }
  },
  ERRORS_CLEAR_ERRORS: (_state, _payload) => {
    return {
      ...initialErrorsState,
    }
  },
})
