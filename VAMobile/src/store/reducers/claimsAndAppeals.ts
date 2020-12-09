import _ from 'underscore'

import { ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsList } from 'store/api'
import createReducer from './createReducer'

export type ClaimsAndAppealsState = {
  loading: boolean
  error?: Error
  claimsAndAppealsList?: ClaimsAndAppealsList
  activeOrClosedClaimsAndAppeals?: ClaimsAndAppealsList
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {
  loading: false,
  claimsAndAppealsList: [] as ClaimsAndAppealsList,
  activeOrClosedClaimsAndAppeals: [] as ClaimsAndAppealsList,
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
})
