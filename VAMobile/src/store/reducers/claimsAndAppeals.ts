import _ from 'underscore'

import { AppealData, ClaimData, ClaimsAndAppealsList } from 'store/api'
import { ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import createReducer from './createReducer'

export type ClaimsAndAppealsState = {
  loading: boolean
  error?: Error
  claimsAndAppealsList?: ClaimsAndAppealsList
  activeOrClosedClaimsAndAppeals?: ClaimsAndAppealsList
  claim?: ClaimData
  appeal?: AppealData
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {
  loading: false,
  claimsAndAppealsList: [] as ClaimsAndAppealsList,
  activeOrClosedClaimsAndAppeals: [] as ClaimsAndAppealsList,
  claim: undefined,
  appeal: undefined,
}

export default createReducer<ClaimsAndAppealsState>(initialClaimsAndAppealsState, {
  CLAIMS_AND_APPEALS_START_GET_ALL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_ALL: (state, { claimsAndAppealsList, error }) => {
    return {
      ...state,
      claimsAndAppealsList,
      error,
      loading: false,
    }
  },
  CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED: (state, { claimType }) => {
    const activeOrClosedClaimsAndAppeals = state.claimsAndAppealsList?.filter((claimAndAppeal) => {
      // if the claim type is ACTIVE, we must get all claims and appeals where completed is false
      // if the claim type is CLOSED, we must get all claims and appeals where completed is true
      const valueToCompareCompleted = claimType !== ClaimTypeConstants.ACTIVE
      return claimAndAppeal.attributes.completed === valueToCompareCompleted
    })

    return {
      ...state,
      activeOrClosedClaimsAndAppeals: _.sortBy(activeOrClosedClaimsAndAppeals || [], (claimAndAppeal) => {
        return new Date(claimAndAppeal.attributes.updatedAt)
      }).reverse(),
    }
  },
  CLAIMS_AND_APPEALS_START_GET_ClAIM: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_ClAIM: (state, { claim, error }) => {
    return {
      ...state,
      claim,
      error,
      loading: false,
    }
  },
  CLAIMS_AND_APPEALS_START_GET_APPEAL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_APPEAL: (state, { appeal, error }) => {
    return {
      ...state,
      appeal,
      error,
      loading: false,
    }
  },
})
