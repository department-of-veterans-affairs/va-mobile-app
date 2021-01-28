import { APIError } from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes, CommonErrors } from 'constants/errors'

const dispatchSetError = (errorType: CommonErrorTypes, screenID?: string): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
      screenID,
    },
  }
}

/**
 * Redux action to set a specific error type
 */
export const setError = (errorType: CommonErrorTypes, screenID?: string): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchSetError(errorType, screenID))
  }
}

/**
 * Redux action to find out which error to set
 */
export const setCommonError = (error: APIError, screenID?: string): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    if (error.networkError) {
      await dispatch(setError(CommonErrors.NETWORK_CONNECTION_ERROR, screenID))
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

const dispatchSetTryAgainFunction = (tryAgain: () => Promise<void>): ReduxAction => {
  return {
    type: 'ERRORS_SET_TRY_AGAIN_FUNCTION',
    payload: {
      tryAgain,
    },
  }
}

/**
 * Redux action to set try again action method
 */
export const setTryAgainFunction = (tryAgain: () => Promise<void>): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchSetTryAgainFunction(tryAgain))
  }
}
