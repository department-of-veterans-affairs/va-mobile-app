import { AsyncReduxAction, ReduxAction } from '../types'

import { APIError, ImmunizationList, ImmunizationListData, ScreenIDTypes } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from '../../utils/common'

/**
 * Action to signify the beginning of the immunization list loading.
 */
const dispatchStartGetImmunizations = (): ReduxAction => {
  return {
    type: 'IMMUNIZATION_START_GET_IMMUNIZATIONS',
    payload: {},
  }
}

/**
 * Action to signal the immunizations have finished loading
 * @param immunizations - list of immunizations if the api call was successful
 * @param error - error to parse if api call failed
 */
const dispatchFinishGetImmunizations = (immunizations?: ImmunizationList, error?: APIError): ReduxAction => {
  return {
    type: 'IMMUNIZATION_FINISH_GET_IMMUNIZATIONS',
    payload: {
      immunizations,
      error,
    },
  }
}

/**
 * Get's the list of immunizations for the given user
 * @param screenID - screen that is waiting for immunizations to load
 */
export const getImmunizations = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getImmunizations(screenID))))

    try {
      dispatch(dispatchStartGetImmunizations())
      const mockData = (await import('./mocks/immunizations.json')) as ImmunizationListData
      dispatch(dispatchFinishGetImmunizations(mockData.data))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetImmunizations(undefined, err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}
