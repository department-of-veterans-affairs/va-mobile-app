import _ from 'underscore'

import { AppealData, ClaimData, ClaimsAndAppealsErrorServiceTypesConstants, ClaimsAndAppealsGetDataMetaError, ClaimsAndAppealsList } from 'store/api'
import { ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import createReducer from './createReducer'

export type ClaimsAndAppealsState = {
  loadingAllClaimsAndAppeals: boolean
  loadingClaim: boolean
  loadingAppeal: boolean
  loadingSubmitClaimDecision: boolean
  error?: Error
  claimsAndAppealsList?: ClaimsAndAppealsList
  claimsServiceError?: boolean
  appealsServiceError?: boolean
  activeOrClosedClaimsAndAppeals?: ClaimsAndAppealsList
  claim?: ClaimData
  appeal?: AppealData
  submittedDecision?: boolean
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {
  loadingAllClaimsAndAppeals: false,
  loadingClaim: false,
  loadingAppeal: false,
  loadingSubmitClaimDecision: false,
  claimsAndAppealsList: [] as ClaimsAndAppealsList,
  claimsServiceError: false,
  appealsServiceError: false,
  activeOrClosedClaimsAndAppeals: [] as ClaimsAndAppealsList,
  claim: undefined,
  appeal: undefined,
  submittedDecision: false,
}

export default createReducer<ClaimsAndAppealsState>(initialClaimsAndAppealsState, {
  CLAIMS_AND_APPEALS_START_GET_ALL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingAllClaimsAndAppeals: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_ALL: (state, { claimsAndAppealsList, claimsAndAppealsMetaErrors, error }) => {
    const claimsServiceError = !!claimsAndAppealsMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
    const appealsServiceError = !!claimsAndAppealsMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)

    return {
      ...state,
      claimsAndAppealsList,
      claimsServiceError,
      appealsServiceError,
      error,
      loadingAllClaimsAndAppeals: false,
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
      loadingClaim: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_ClAIM: (state, { claim, error }) => {
    return {
      ...state,
      claim,
      error,
      loadingClaim: false,
    }
  },
  CLAIMS_AND_APPEALS_START_GET_APPEAL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingAppeal: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_APPEAL: (state, { appeal, error }) => {
    return {
      ...state,
      appeal,
      error,
      loadingAppeal: false,
    }
  },
  CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingSubmitClaimDecision: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION: (state, { error }) => {
    return {
      ...state,
      error,
      loadingSubmitClaimDecision: false,
      submittedDecision: true,
    }
  },
})
