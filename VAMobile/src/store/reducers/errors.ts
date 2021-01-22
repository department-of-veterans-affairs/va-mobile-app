import createReducer from './createReducer'

export const CommonErrorTypes = {
  NETWORK_CONNECTION_ERROR: 'networkConnectionError',
}

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
})
