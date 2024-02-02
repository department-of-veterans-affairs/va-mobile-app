import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { chain } from 'underscore'

import * as api from '../api'
import { AppThunk } from 'store'
import {
  AppealData,
  ClaimData,
  ClaimsAndAppealsErrorServiceTypesConstants,
  ClaimsAndAppealsGetData,
  ClaimsAndAppealsGetDataMetaPagination,
  ClaimsAndAppealsList,
  ScreenIDTypes,
} from 'store/api/types'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { DEFAULT_PAGE_SIZE } from 'constants/common'

import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange, isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

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
  finishedLoadingClaimsAndAppeals: boolean
  error?: Error
  claimsServiceError: boolean
  appealsServiceError: boolean
  claim?: ClaimData
  appeal?: AppealData
  submittedDecision: boolean
  filesUploadedSuccess: boolean
  fileUploadedFailure: boolean
  claimsAndAppealsByClaimType: ClaimsAndAppealsListType
  loadedClaimsAndAppeals: ClaimsAndAppealsListType
  claimsAndAppealsMetaPagination: ClaimsAndAppealsMetaPaginationType
  cancelLoadingDetailScreen?: AbortController // abortController to canceling loading of claim(getClaim) and appeal(getAppeal) detail screens
}

const claimsAndAppealsNonFatalErrorString = 'Claims And Appeals Service Error'

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
  finishedLoadingClaimsAndAppeals: false,
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
  cancelLoadingDetailScreen: undefined,
}

const emptyClaimsAndAppealsGetData: api.ClaimsAndAppealsGetData = {
  data: [],
  meta: {
    dataFromStore: false,
    errors: [],
    pagination: {
      totalEntries: 0,
      currentPage: 1,
      perPage: DEFAULT_PAGE_SIZE,
    },
  },
}

export const sortByLatestDate = (claimsAndAppeals: ClaimsAndAppealsList): ClaimsAndAppealsList => {
  return chain(claimsAndAppeals)
    .sortBy((claimAndAppeal) => new Date(claimAndAppeal.attributes.dateFiled))
    .sortBy((claimAndAppeal) => new Date(claimAndAppeal.attributes.updatedAt))
    .reverse()
    .value()
}

// Return data that looks like ClaimsAndAppealsGetData if data was loaded previously otherwise null
const getLoadedClaimsAndAppeals = (
  claimsAndAppeals: ClaimsAndAppealsListType,
  paginationMetaData: ClaimsAndAppealsMetaPaginationType,
  claimType: ClaimType,
  latestPage: number,
  pageSize: number,
) => {
  const loadedClaimsAndAppeals = getItemsInRange(claimsAndAppeals[claimType], latestPage, pageSize)
  // do we have the claimsAndAppeals?
  if (loadedClaimsAndAppeals) {
    return {
      data: loadedClaimsAndAppeals,
      meta: {
        pagination: {
          currentPage: latestPage,
          perPage: pageSize,
          totalEntries: paginationMetaData[claimType].totalEntries,
        },
        dataFromStore: true, // informs reducer not to save these claimsAndAppeals to the store
      },
    } as api.ClaimsAndAppealsGetData
  }
  return null
}

/**
 * Redux action to prefetch claims and appeals
 */
export const prefetchClaimsAndAppeals =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchClaimsAndAppeals(screenID))))
    dispatch(dispatchStartPrefetchGetClaimsAndAppeals())

    try {
      let activeClaimsAndAppeals: api.ClaimsAndAppealsGetData | undefined
      let closedClaimsAndAppeals: api.ClaimsAndAppealsGetData | undefined

      const { claimsAndAppealsMetaPagination, loadedClaimsAndAppeals: loadedItems } = getState().claimsAndAppeals
      const activeLoadedClaimsAndAppeals = getLoadedClaimsAndAppeals(loadedItems, claimsAndAppealsMetaPagination, ClaimTypeConstants.ACTIVE, 1, DEFAULT_PAGE_SIZE)
      const closedLoadedClaimsAndAppeals = getLoadedClaimsAndAppeals(loadedItems, claimsAndAppealsMetaPagination, ClaimTypeConstants.CLOSED, 1, DEFAULT_PAGE_SIZE)

      if (activeLoadedClaimsAndAppeals) {
        activeClaimsAndAppeals = activeLoadedClaimsAndAppeals
      } else {
        activeClaimsAndAppeals = await api.get<api.ClaimsAndAppealsGetData>('/v0/claims-and-appeals-overview', {
          'page[number]': '1',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          showCompleted: 'false',
        })
      }

      if (closedLoadedClaimsAndAppeals) {
        closedClaimsAndAppeals = closedLoadedClaimsAndAppeals
      } else {
        closedClaimsAndAppeals = await api.get<api.ClaimsAndAppealsGetData>('/v0/claims-and-appeals-overview', {
          'page[number]': '1',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          showCompleted: 'true',
        })
      }

      dispatch(dispatchFinishPrefetchGetClaimsAndAppeals({ active: activeClaimsAndAppeals, closed: closedClaimsAndAppeals }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `prefetchClaimsAndAppeals: ${claimsAndAppealsNonFatalErrorString}`)
        dispatch(dispatchFinishPrefetchGetClaimsAndAppeals({ active: undefined, closed: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to get all claims and appeals
 */
export const getClaimsAndAppeals =
  (claimType: ClaimType, screenID?: ScreenIDTypes, page = 1): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getClaimsAndAppeals(claimType, screenID, page))))
    dispatch(dispatchStartGetAllClaimsAndAppeals())

    try {
      let claimsAndAppeals
      const isActive = claimType === ClaimTypeConstants.ACTIVE
      const { claimsAndAppealsMetaPagination, loadedClaimsAndAppeals: loadedItems } = getState().claimsAndAppeals
      const loadedClaimsAndAppeals = getLoadedClaimsAndAppeals(loadedItems, claimsAndAppealsMetaPagination, claimType, page, DEFAULT_PAGE_SIZE)
      if (loadedClaimsAndAppeals) {
        claimsAndAppeals = loadedClaimsAndAppeals
      } else {
        claimsAndAppeals = await api.get<api.ClaimsAndAppealsGetData>('/v0/claims-and-appeals-overview', {
          'page[number]': page.toString(),
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          showCompleted: isActive ? 'false' : 'true',
        })
      }

      dispatch(dispatchFinishAllClaimsAndAppeals({ claimType, claimsAndAppeals }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getClaimsAndAppeals: ${claimsAndAppealsNonFatalErrorString}`)
        dispatch(dispatchFinishAllClaimsAndAppeals({ claimType, claimsAndAppeals: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const claimsAndAppealsSlice = createSlice({
  name: 'claimsAndAppeals',
  initialState: initialClaimsAndAppealsState,
  reducers: {
    dispatchStartPrefetchGetClaimsAndAppeals: (state) => {
      state.loadingClaimsAndAppeals = true
    },

    dispatchFinishPrefetchGetClaimsAndAppeals: (state, action: PayloadAction<{ active?: ClaimsAndAppealsGetData; closed?: ClaimsAndAppealsGetData; error?: Error }>) => {
      const { active, closed, error } = action.payload
      const activeData = active || emptyClaimsAndAppealsGetData
      const closedData = closed || emptyClaimsAndAppealsGetData
      const activeMetaErrors = activeData?.meta?.errors || []
      const closedMetaErrors = closedData?.meta?.errors || []
      const activeAndClosedMetaErrors = [...activeMetaErrors, ...closedMetaErrors]
      const claimsServiceError = !!activeAndClosedMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
      const appealsServiceError = !!activeAndClosedMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)
      const curLoadedActive = state.loadedClaimsAndAppeals.ACTIVE
      const curLoadedClosed = state.loadedClaimsAndAppeals.CLOSED
      const activeList = sortByLatestDate(activeData?.data || [])
      const closedList = sortByLatestDate(closedData?.data || [])

      state.claimsServiceError = claimsServiceError
      state.appealsServiceError = appealsServiceError
      state.error = error
      state.loadingClaimsAndAppeals = false
      state.finishedLoadingClaimsAndAppeals = true
      state.claimsAndAppealsByClaimType.ACTIVE = activeList
      state.claimsAndAppealsByClaimType.CLOSED = closedList
      state.claimsAndAppealsMetaPagination.ACTIVE = activeData?.meta?.pagination || state.claimsAndAppealsMetaPagination.ACTIVE
      state.claimsAndAppealsMetaPagination.CLOSED = closedData?.meta?.pagination || state.claimsAndAppealsMetaPagination.CLOSED
      state.loadedClaimsAndAppeals.ACTIVE = activeData?.meta.dataFromStore ? curLoadedActive : curLoadedActive.concat(activeList)
      state.loadedClaimsAndAppeals.CLOSED = closedData?.meta.dataFromStore ? curLoadedClosed : curLoadedClosed.concat(closedList)
    },

    dispatchStartGetAllClaimsAndAppeals: (state) => {
      state.loadingClaimsAndAppeals = true
    },

    dispatchFinishAllClaimsAndAppeals: (state, action: PayloadAction<{ claimType: ClaimType; claimsAndAppeals?: ClaimsAndAppealsGetData; error?: Error }>) => {
      const { claimType, claimsAndAppeals, error } = action.payload

      const claimsAndAppealsMetaErrors = claimsAndAppeals?.meta?.errors || []
      const claimsServiceError = !!claimsAndAppealsMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
      const appealsServiceError = !!claimsAndAppealsMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)
      const curLoadedClaimsAndAppeals = state.loadedClaimsAndAppeals[claimType]
      const claimsAndAppealsList = sortByLatestDate(claimsAndAppeals?.data || [])

      state.claimsServiceError = claimsServiceError
      state.appealsServiceError = appealsServiceError
      state.error = error
      state.loadingClaimsAndAppeals = false
      state.claimsAndAppealsByClaimType[claimType] = claimsAndAppealsList
      state.claimsAndAppealsMetaPagination[claimType] = claimsAndAppeals?.meta?.pagination || state.claimsAndAppealsMetaPagination[claimType]
      state.loadedClaimsAndAppeals[claimType] = claimsAndAppeals?.meta.dataFromStore ? curLoadedClaimsAndAppeals : curLoadedClaimsAndAppeals.concat(claimsAndAppealsList)
    },

    dispatchClearLoadedClaimsAndAppeals: () => {
      return { ...initialClaimsAndAppealsState }
    },
  },
})

export const {
  dispatchFinishPrefetchGetClaimsAndAppeals,
  dispatchStartPrefetchGetClaimsAndAppeals,
  dispatchStartGetAllClaimsAndAppeals,
  dispatchFinishAllClaimsAndAppeals,
  dispatchClearLoadedClaimsAndAppeals,
} = claimsAndAppealsSlice.actions
export default claimsAndAppealsSlice.reducer
