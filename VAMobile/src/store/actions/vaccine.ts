import { AsyncReduxAction, ReduxAction } from '../types'

import * as api from '../api'
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

      const vaccineData = await api.get<VaccineListData>('/v0/health/immunizations')

      const hasRequiredFields = vaccineData?.data.every((v) => {
        return !!v.attributes?.date && !!v.attributes?.groupName && !!v.attributes?.shortDescription
      })

      // Ensure all required fields(date, groupName, and type and dosage) exist; otherwise throw API Error
      if (!hasRequiredFields) {
        throw { status: 500, json: { errors: [] } } as APIError
      }

      dispatch(dispatchFinishGetVaccines(vaccineData?.data))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetVaccines(undefined, err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err, screenID), screenID))
      }
    }
  }
}
