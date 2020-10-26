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
      serviceHistory,
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
export const getServiceHistory = (useMockData?: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartGetHistory())
      // TODO remove onces backend endpoint is ready
      if (useMockData) {
        dispatch(
          dispatchFinishGetHistory([
            {
              branchOfService: 'United States Marine Corps',
              beginDate: '1993-06-04',
              endDate: '1995-07-10',
              formattedBeginDate: 'June 04, 1993',
              formattedEndDate: 'July 10, 1995',
            },
            {
              branchOfService: 'United States Marine Corps',
              beginDate: '1997-09-17',
              endDate: '2002-12-31',
              formattedBeginDate: 'September 17, 1997',
              formattedEndDate: 'December 31, 2002',
            },
          ]),
        )
      } else {
        const mshData = await api.get<api.MilitaryServiceHistoryData>('/v0/military-service-history')
        dispatch(dispatchFinishGetHistory(mshData?.data.attributes.serviceHistory))
      }
    } catch (err) {
      dispatch(dispatchFinishGetHistory(undefined, err))
    }
  }
}
