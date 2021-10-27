import { AsyncReduxAction, ReduxAction } from '../types'

import { APIError, ScreenIDTypes, VaccineList, VaccineListData } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from '../../utils/common'

/**
 * Action to signify the beginning of the vaccine list loading.
 */
const dispatchStartGetVaccines = (): ReduxAction => {
  return {
    type: 'VACCINE_START_GET_VACCINES',
    payload: {},
  }
}

/**
 * Action to signal the vaccines have finished loading
 * @param vaccines - list of vaccines if the api call was successful
 * @param error - error to parse if api call failed
 */
const dispatchFinishGetVaccines = (vaccines?: VaccineList, error?: APIError): ReduxAction => {
  return {
    type: 'VACCINE_FINISH_GET_VACCINES',
    payload: {
      vaccines,
      error,
    },
  }
}

/**
 * Get's the list of vaccines for the given user
 * @param screenID - screen that is waiting for vaccines to load
 */
export const getVaccines = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getVaccines(screenID))))

    try {
      dispatch(dispatchStartGetVaccines())
      const mockData = (await import('./mocks/vaccines.json')) as VaccineListData
      dispatch(dispatchFinishGetVaccines(mockData.data))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetVaccines(undefined, err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err, screenID), screenID))
      }
    }
  }
}
