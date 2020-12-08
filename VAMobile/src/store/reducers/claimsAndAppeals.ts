import { ClaimsAndAppealsList } from 'store/api'
import createReducer from './createReducer'

export type ClaimsAndAppealsState = {
  loading: boolean
  error?: Error
  claimsAndAppealsList?: ClaimsAndAppealsList
  activeClaimsAndAppeals?: ClaimsAndAppealsList
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {
  loading: false,
  claimsAndAppealsList: [] as ClaimsAndAppealsList,
  activeClaimsAndAppeals: [] as ClaimsAndAppealsList,
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
  CLAIMS_AND_APPEALS_GET_ACTIVE: (state, payload) => {
    const activeClaimsAndAppeals = state.claimsAndAppealsList?.filter((claimAndAppeal) => claimAndAppeal.attributes.completed === false)

    return {
      ...state,
      ...payload,
      activeClaimsAndAppeals,
    }
  },
})
