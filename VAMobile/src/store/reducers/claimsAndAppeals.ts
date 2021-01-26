import _ from 'underscore'

import { AppealData, ClaimData, ClaimsAndAppealsList } from 'store/api'
import { ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import createReducer from './createReducer'

export type ClaimsAndAppealsState = {
  loadingAllClaimsAndAppeals: boolean
  loadingClaim: boolean
  loadingAppeal: boolean
  loadingSubmitClaimDecision: boolean
  loadingFileUpload: boolean
  error?: Error
  claimsAndAppealsList?: ClaimsAndAppealsList
  activeOrClosedClaimsAndAppeals?: ClaimsAndAppealsList
  claim?: ClaimData
  appeal?: AppealData
  submittedDecision?: boolean
  filesUploadedSuccess?: boolean
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {
  loadingAllClaimsAndAppeals: false,
  loadingClaim: false,
  loadingAppeal: false,
  loadingSubmitClaimDecision: false,
  loadingFileUpload: false,
  claimsAndAppealsList: [] as ClaimsAndAppealsList,
  activeOrClosedClaimsAndAppeals: [] as ClaimsAndAppealsList,
  claim: undefined,
  appeal: undefined,
  submittedDecision: false,
  filesUploadedSuccess: false,
}

export default createReducer<ClaimsAndAppealsState>(initialClaimsAndAppealsState, {
  CLAIMS_AND_APPEALS_START_GET_ALL: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingAllClaimsAndAppeals: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET_ALL: (state, { claimsAndAppealsList, error }) => {
    return {
      ...state,
      claimsAndAppealsList,
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
  CLAIMS_AND_APPEALS_START_FILE_UPLOAD: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingFileUpload: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD: (state, { error }) => {
    return {
      ...state,
      error,
      loadingFileUpload: false,
      filesUploadedSuccess: true,
    }
  },
  CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS: (state, payload) => {
    return {
      ...state,
      ...payload,
      filesUploadedSuccess: false,
    }
  },
})
