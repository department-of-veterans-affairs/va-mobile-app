import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes } from 'constants/errors'
import { omit, some, values } from 'underscore'

const dispatchSetError = (errorType: CommonErrorTypes, bool: boolean, wasError: boolean): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
      bool,
      wasError,
    },
  }
}

/**
 * Redux action to set a specific error status to true or false
 */
export const setError = (errorType: CommonErrorTypes, bool: boolean): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    /*
     * If setting error to false, get a list of all values of error states while omitting
     * the master non-specific error variables and the error type to be set. If the rest of the
     * specific errors are false this means all specific errors are about to be false, set master wasError to false
     */
    const errors = omit(getState()?.errors, ['wasError', errorType])
    const wasError = bool ? true : some(values(errors))
    dispatch(dispatchSetError(errorType, bool, wasError))
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
