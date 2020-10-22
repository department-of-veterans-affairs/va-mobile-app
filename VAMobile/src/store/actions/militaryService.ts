import { AsyncReduxAction, MilitaryServiceFinishGetHistoryAction, MilitaryServiceStartGetHistoryAction } from 'store/types'

import * as api from 'store/api'

const dispatchStartGetHistory = (): MilitaryServiceStartGetHistoryAction => {
  return {
    type: 'MILITARY_SERVICE_START_GET_HISTORY',
    payload: {},
  }
}

const dispatchFinishGetHistory = (serviceHistory?: api.ServiceHistoryData, error?: Error): MilitaryServiceFinishGetHistoryAction => {
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
export const getServiceHistory = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartGetHistory())
      const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')
      dispatch(dispatchFinishGetHistory(mshData?.data.attributes.serviceHistory))
    } catch (err) {
      dispatch(dispatchFinishGetHistory(undefined, err))
    }
  }
}
