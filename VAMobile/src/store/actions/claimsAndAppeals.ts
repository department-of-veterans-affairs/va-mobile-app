import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { ClaimsAndAppealsList } from '../api/types'

const dispatchStartGetAllClaimsAndAppeals = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET_ALL',
    payload: {},
  }
}

const dispatchFinishAllClaimsAndAppeals = (claimsAndAppealsList?: ClaimsAndAppealsList, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET_ALL',
    payload: {
      claimsAndAppealsList,
      error,
    },
  }
}

/**
 * Redux action to get all claims and appeals
 */
export const getAllClaimsAndAppeals = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartGetAllClaimsAndAppeals())

    try {
      // const test = await api.get<ClaimsAndAppealsList>('/v0/claims-and-appeals/overview')

      // TODO: use endpoint when available
      const claimsAndAppealsList: ClaimsAndAppealsList = [
        {
          id: '1',
          type: 'appeal',
          attributes: {
            subtype: 'Compensation',
            completed: false,
            dateFiled: '2020-10-22T20:15:14.000+00:00',
            updatedAt: '2020-10-28T20:15:14.000+00:00',
          },
        },
        {
          id: '0',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: false,
            dateFiled: '2020-11-13T20:15:14.000+00:00',
            updatedAt: '2020-11-30T20:15:14.000+00:00',
          },
        },
      ]

      dispatch(dispatchFinishAllClaimsAndAppeals(claimsAndAppealsList))
    } catch (error) {
      dispatch(dispatchFinishAllClaimsAndAppeals(undefined, error))
    }
  }
}

const dispatchGetActiveClaimsAndAppeals = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_GET_ACTIVE',
    payload: {},
  }
}

/**
 * Redux action to get all active claims and appeals
 */
export const getActiveClaimsAndAppeals = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchGetActiveClaimsAndAppeals())
  }
}
