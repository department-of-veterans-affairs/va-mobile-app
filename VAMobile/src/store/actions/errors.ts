import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes } from 'constants/errors'

const dispatchSetError = (errorType: CommonErrorTypes): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
    },
  }
}

/**
 * Redux action to set a specific error status to true or false
 */
export const setError = (errorType: CommonErrorTypes): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchSetError(errorType))
  }
}

const dispatchClearErrors = (): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ERRORS',
    payload: {},
  }
}

/**
 * Redux action to clear/reset all errors back to initial state
 */
export const clearErrors = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchClearErrors())
  }
}
