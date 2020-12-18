import { appeal as Appeal } from 'screens/ClaimsScreen/appealData'
import { AppealData, ClaimData, ClaimsAndAppealsList } from '../api/types'
import { AsyncReduxAction, ReduxAction } from '../types'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ClaimType } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'

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
      // const claimsAndAppealsList = await api.get<ClaimsAndAppealsList>('/v0/claims-and-appeals/overview')

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
            subtype: 'Disability',
            completed: false,
            dateFiled: '2020-11-13T20:15:14.000+00:00',
            updatedAt: '2020-11-30T20:15:14.000+00:00',
          },
        },
        {
          id: '4',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: false,
            dateFiled: '2020-06-11T20:15:14.000+00:00',
            updatedAt: '2020-12-07T20:15:14.000+00:00',
          },
        },
        {
          id: '2',
          type: 'appeal',
          attributes: {
            subtype: 'Disability',
            completed: true,
            dateFiled: '2020-07-24T20:15:14.000+00:00',
            updatedAt: '2020-09-15T20:15:14.000+00:00',
          },
        },
        {
          id: '3',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: true,
            dateFiled: '2020-11-18T20:15:14.000+00:00',
            updatedAt: '2020-12-05T20:15:14.000+00:00',
          },
        },
      ]

      dispatch(dispatchFinishAllClaimsAndAppeals(claimsAndAppealsList))
    } catch (error) {
      dispatch(dispatchFinishAllClaimsAndAppeals(undefined, error))
    }
  }
}

const dispatchGetActiveOrClosedClaimsAndAppeals = (claimType: ClaimType): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED',
    payload: {
      claimType,
    },
  }
}

/**
 * Redux action to get all active claims and appeals or all closed claims and appeals
 */
export const getActiveOrClosedClaimsAndAppeals = (claimType: ClaimType): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchGetActiveOrClosedClaimsAndAppeals(claimType))
  }
}

const dispatchStartGetClaim = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM',
    payload: {},
  }
}

const dispatchFinishGetClaim = (claim?: ClaimData, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM',
    payload: {
      claim,
      error,
    },
  }
}

/**
 * Redux action to get single claim
 */
export const getClaim = (id: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartGetClaim())

    try {
      // TODO: use endpoint when available
      // const claim = await api.get<api.ClaimData>(`/v0/claim/${id}`)

      console.log('Get claim by ID: ', id)

      const claim: ClaimData = Claim

      dispatch(dispatchFinishGetClaim(claim))
    } catch (error) {
      dispatch(dispatchFinishGetClaim(undefined, error))
    }
  }
}

const dispatchStartGetAppeal = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET_APPEAL',
    payload: {},
  }
}

const dispatchFinishGetAppeal = (appeal?: AppealData, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET_APPEAL',
    payload: {
      appeal,
      error,
    },
  }
}

/**
 * Redux action to get single appeal
 */
export const getAppeal = (id: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartGetAppeal())

    try {
      // TODO: use endpoint when available
      // const appeal = await api.get<api.AppealData>(`/v0/appeal/${id}`)

      console.log('Get appeal by ID: ', id)

      const appeal: AppealData = Appeal

      dispatch(dispatchFinishGetAppeal(appeal))
    } catch (error) {
      dispatch(dispatchFinishGetAppeal(undefined, error))
    }
  }
}
