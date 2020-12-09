import { AsyncReduxAction, ReduxAction } from '../types'
import { ClaimData, ClaimsAndAppealsList } from '../api/types'
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

      console.log('Get claim by ID: ', id)

      const claim: ClaimData = {
        id: '600156928',
        type: 'evss_claims',
        attributes: {
          evssId: 600156928,
          dateFiled: '2019-06-06',
          minEstDate: '2019-10-02',
          maxEstDate: '2019-12-11',
          phaseChangeDate: '2019-06-22',
          open: true,
          waiverSubmitted: false,
          documentsNeeded: true,
          developmentLetterSent: true,
          decisionLetterSent: false,
          phase: 3,
          everPhaseBack: false,
          currentPhaseBack: false,
          requestedDecision: false,
          claimType: 'Compensation',
          updatedAt: '2020-12-07T20:37:12.041Z',
          contentionList: ['Hearing Loss (Increase)', ' ankle strain (related to: PTSD - Combat', 'POW) (New)', ' Diabetes mellitus2 (Secondary)'],
          vaRepresentative: 'AMERICAN LEGION',
          eventsTimeline: [
            {
              type: 'never_received_from_you_list',
              trackedItemId: 255455,
              description: 'New &amp; material evidence needed - denied SC previously (PTSD)',
              displayName: 'Request 42',
              overdue: false,
              status: 'NO_LONGER_REQUIRED',
              uploaded: false,
              uploadsAllowed: false,
              openedDate: undefined,
              requestedDate: '2019-07-09',
              receivedDate: undefined,
              closedDate: '2019-08-08',
              suspenseDate: undefined,
              documents: [],
              uploadDate: '2019-08-08',
              date: '2019-08-08',
            },
          ],
        },
      }

      dispatch(dispatchFinishGetClaim(claim))
    } catch (error) {
      dispatch(dispatchFinishGetClaim(undefined, error))
    }
  }
}
