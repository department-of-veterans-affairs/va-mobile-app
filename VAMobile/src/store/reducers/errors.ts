import createReducer from './createReducer'

export type ErrorsState = {
  networkConnectionError: boolean
}

export const initialErrorsState: ErrorsState = {
  networkConnectionError: false,
}

export default createReducer<ErrorsState>(initialErrorsState, {
  ERRORS_SET_ERROR: (state, { errorType, bool }) => {
    return {
      ...state,
      [errorType]: bool,
    }
  },
  ERRORS_CLEAR_ERRORS: (_state, _payload) => {
    return {
      ...initialErrorsState,
    }
  },
})
