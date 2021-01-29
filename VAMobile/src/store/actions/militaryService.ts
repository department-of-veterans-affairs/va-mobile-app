import { AsyncReduxAction, ReduxAction } from 'store/types'

import * as api from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

const dispatchStartGetHistory = (): ReduxAction => {
  return {
    type: 'MILITARY_SERVICE_START_GET_HISTORY',
    payload: {},
  }
}

const dispatchFinishGetHistory = (serviceHistory?: api.ServiceHistoryData, error?: Error): ReduxAction => {
  return {
    type: 'MILITARY_SERVICE_FINISH_GET_HISTORY',
    payload: {
      serviceHistory,
      error,
    },
  }
}

/**
 * Redux action to get service history for user
 *
 * @returns AsyncReduxAction
 */
export const getServiceHistory = (screenID?: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getServiceHistory(screenID))))

    try {
      dispatch(dispatchStartGetHistory())
      const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')

      dispatch(dispatchFinishGetHistory(mshData?.data.attributes.serviceHistory))
    } catch (err) {
      dispatch(dispatchFinishGetHistory(undefined, err))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
    }
  }
}
