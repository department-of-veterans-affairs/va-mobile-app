import { AsyncReduxAction, ReduxAction } from 'store/types'

import * as api from 'store/api'

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
      serviceHistory: serviceHistory,
      error,
    },
  }
}

/**
 * Redux action to get service history for user
 *
 * @param useMockData - boolean to determine when to use mock data(remove param when backend ready)
 *
 * @returns AsyncReduxAction
 */
export const getServiceHistory = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartGetHistory())
      const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')
      dispatch(dispatchFinishGetHistory(mshData?.data.attributes.service_history))
    } catch (err) {
      dispatch(dispatchFinishGetHistory(undefined, err))
    }
  }
}
