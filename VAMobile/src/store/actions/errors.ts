import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes } from 'store/reducers'

const dispatchSetError = (errorType: string, bool: boolean): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
      bool,
    },
  }
}

export const setError = (errorType: string, bool: boolean): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchSetError(errorType, bool))
  }
}
