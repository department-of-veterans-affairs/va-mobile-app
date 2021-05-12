import _ from 'underscore'

import { AppealData, ClaimData, ClaimsAndAppealsErrorServiceTypesConstants, ClaimsAndAppealsGetDataMetaPagination, ClaimsAndAppealsList } from 'store/api'
import { ClaimType } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import createReducer from './createReducer'

export type ClaimsAndAppealsState = {
  loadingClaimsAndAppeals: boolean
  loadingClaim: boolean
  loadingAppeal: boolean
  loadingSubmitClaimDecision: boolean
  loadingFileUpload: boolean
  error?: Error
  claimsServiceError?: boolean
  appealsServiceError?: boolean
  claim?: ClaimData
  appeal?: AppealData
  submittedDecision?: boolean
  filesUploadedSuccess?: boolean
  claimsAndAppealsList: {
    [key in ClaimType]: ClaimsAndAppealsList
  }
  claimsAndAppealsMetaPagination: {
    [key in ClaimType]: ClaimsAndAppealsGetDataMetaPagination
  }
}
const initialPaginationState = {
  currentPage: 1,
  totalEntries: 0,
  perPage: 0,
}

export const initialClaimsAndAppealsState: ClaimsAndAppealsState = {
  loadingClaimsAndAppeals: false,
  loadingClaim: false,
  loadingAppeal: false,
  loadingSubmitClaimDecision: false,
  loadingFileUpload: false,
  claimsServiceError: false,
  appealsServiceError: false,
  claim: undefined,
  appeal: undefined,
  submittedDecision: false,
  filesUploadedSuccess: false,
  claimsAndAppealsList: {
    ACTIVE: [],
    CLOSED: [],
  },
  claimsAndAppealsMetaPagination: {
    ACTIVE: initialPaginationState,
    CLOSED: initialPaginationState,
  },
}

export const sortByLatestDate = (claimsAndAppeals: ClaimsAndAppealsList): ClaimsAndAppealsList => {
  return _.sortBy(claimsAndAppeals || [], (claimAndAppeal) => {
    return new Date(claimAndAppeal.attributes.updatedAt)
  }).reverse()
}

export default createReducer<ClaimsAndAppealsState>(initialClaimsAndAppealsState, {
  CLAIMS_AND_APPEALS_START_GET: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingClaimsAndAppeals: true,
    }
  },
  CLAIMS_AND_APPEALS_FINISH_GET: (state, { claimsAndAppeals, claimType, error }) => {
    const claimsAndAppealsMetaErrors = claimsAndAppeals?.meta?.errors || []
    const claimsServiceError = !!claimsAndAppealsMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
    const appealsServiceError = !!claimsAndAppealsMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)

    return {
      ...state,
      claimsServiceError,
      appealsServiceError,
      error,
      loadingClaimsAndAppeals: false,
      claimsAndAppealsMetaPagination: {
        ...state.claimsAndAppealsMetaPagination,
        [claimType]: claimsAndAppeals?.meta?.pagination || state.claimsAndAppealsMetaPagination[claimType],
      },
      claimsAndAppealsList: {
        ...state.claimsAndAppealsList,
        [claimType]: sortByLatestDate(claimsAndAppeals?.data || []),
      },
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
  CLAIMS_AND_APPEALS_CLEAR_LOADED_CLAIMS_AND_APPEALS: (_state, _payload) => {
    return initialClaimsAndAppealsState
  },
})
