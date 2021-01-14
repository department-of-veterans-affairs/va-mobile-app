import * as api from '../api'
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
      const claimsAndAppeals = await api.get<api.ClaimsAndAppealsGetData>('/v0/claims-and-appeals-overview')
      dispatch(dispatchFinishAllClaimsAndAppeals(claimsAndAppeals?.data))
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

const dispatchStartSubmitClaimDecision = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION',
    payload: {},
  }
}

const dispatchFinishSubmitClaimDecision = (error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION',
    payload: {
      error,
    },
  }
}

/**
 * Redux action to notify VA to make a claim decision
 */
export const submitClaimDecision = (claimID: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartSubmitClaimDecision())

    try {
      // TODO: use endpoint when available
      console.log('Claim ID: ', claimID)

      Claim.attributes.waiverSubmitted = true

      dispatch(dispatchFinishSubmitClaimDecision())
    } catch (error) {
      dispatch(dispatchFinishSubmitClaimDecision(error))
    }
  }
}
