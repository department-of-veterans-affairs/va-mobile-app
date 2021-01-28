import { AsyncReduxAction, ReduxAction } from 'store/types'

import * as api from 'store/api'
import { clearErrors, setCommonError, setTryAgainFunction } from './errors'

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
    await dispatch(setTryAgainFunction(() => dispatch(getServiceHistory(screenID))))

    try {
      dispatch(dispatchStartGetHistory())
      const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')
      dispatch(dispatchFinishGetHistory(mshData?.data.attributes.serviceHistory))

      await dispatch(clearErrors())
    } catch (err) {
      dispatch(dispatchFinishGetHistory(undefined, err))

      await dispatch(setCommonError(err, screenID))
    }
  }
}
