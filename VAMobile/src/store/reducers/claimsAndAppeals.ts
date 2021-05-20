import { DateTime } from 'luxon'
import _ from 'underscore'

import { AppealData, ClaimData, ClaimsAndAppealsErrorServiceTypesConstants, ClaimsAndAppealsGetDataMetaPagination, ClaimsAndAppealsList } from 'store/api'
import { ClaimType } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import createReducer from './createReducer'

export type ClaimsAndAppealsListType = {
  [key in ClaimType]: ClaimsAndAppealsList
}

export type ClaimsAndAppealsMetaPaginationType = {
  [key in ClaimType]: ClaimsAndAppealsGetDataMetaPagination
}

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
  fileUploadedFailure?: boolean
  claimsAndAppealsByClaimType: ClaimsAndAppealsListType
  loadedClaimsAndAppeals: ClaimsAndAppealsListType
  claimsAndAppealsMetaPagination: ClaimsAndAppealsMetaPaginationType
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
  fileUploadedFailure: false,
  claimsAndAppealsByClaimType: {
    ACTIVE: [],
    CLOSED: [],
  },
  loadedClaimsAndAppeals: {
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
    const curLoadedClaimsAndAppeals = state.loadedClaimsAndAppeals[claimType]
    const claimsAndAppealsList = claimsAndAppeals?.data || []

    return {
      ...state,
      claimsServiceError,
      appealsServiceError,
      error,
      loadingClaimsAndAppeals: false,
      claimsAndAppealsByClaimType: {
        ...state.claimsAndAppealsByClaimType,
        [claimType]: claimsAndAppealsList,
      },
      claimsAndAppealsMetaPagination: {
        ...state.claimsAndAppealsMetaPagination,
        [claimType]: claimsAndAppeals?.meta?.pagination || state.claimsAndAppealsMetaPagination[claimType],
      },
      loadedClaimsAndAppeals: {
        ...state.loadedClaimsAndAppeals,
        [claimType]: claimsAndAppeals?.meta.dataFromStore ? curLoadedClaimsAndAppeals : curLoadedClaimsAndAppeals.concat(claimsAndAppealsList),
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
    const claim = state.claim

    if (claim) {
      claim.attributes.waiverSubmitted = true
    }

    return {
      ...state,
      error,
      claim,
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
  CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD: (state, { error, eventDescription }) => {
    const claim = state.claim

    if (claim && !error) {
      const indexOfRequest = claim.attributes.eventsTimeline.findIndex((el) => el.description === eventDescription)
      claim.attributes.eventsTimeline[indexOfRequest].uploaded = true
      claim.attributes.eventsTimeline[indexOfRequest].uploadDate = DateTime.local().toISO()
    }

    return {
      ...state,
      error,
      claim,
      loadingFileUpload: false,
      fileUploadedFailure: !!error,
      filesUploadedSuccess: !error,
    }
  },
  CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS: (state, payload) => {
    return {
      ...state,
      ...payload,
      filesUploadedSuccess: false,
      fileUploadedFailure: false,
    }
  },
  CLAIMS_AND_APPEALS_CLEAR_LOADED_CLAIMS_AND_APPEALS: (_state, _payload) => {
    return initialClaimsAndAppealsState
  },
})
