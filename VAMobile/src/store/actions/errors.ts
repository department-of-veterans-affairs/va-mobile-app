import { APIError } from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes, CommonErrors } from 'constants/errors'

const dispatchSetError = (errorType: CommonErrorTypes): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
    },
  }
}

/**
 * Redux action to set a specific error type
 */
export const setError = (errorType: CommonErrorTypes): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchSetError(errorType))
  }
}

/**
 * Redux action to find out which error to set
 */
export const setCommonError = (error: APIError): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    if (error.networkError) {
      await dispatch(setError(CommonErrors.NETWORK_CONNECTION_ERROR))
    }
    // check other common error cases here
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

const dispatchSetTryAgainAction = (action: () => Promise<void>): ReduxAction => {
  return {
    type: 'ERRORS_SET_TRY_AGAIN_ACTION',
    payload: {
      action,
    },
  }
}

/**
 * Redux action to set try again action method
 */
export const setTryAgainAction = (action: () => Promise<void>): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchSetTryAgainAction(action))
  }
}
