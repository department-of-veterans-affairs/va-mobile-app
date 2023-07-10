import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { find, map, sortBy } from 'underscore'

import * as api from '../api'
import { AppThunk } from 'store'
import {
  AppealData,
  ClaimData,
  ClaimDecisionResponseData,
  ClaimDocUploadData,
  ClaimEventData,
  ClaimEventDocumentData,
  ClaimsAndAppealsErrorServiceTypesConstants,
  ClaimsAndAppealsGetData,
  ClaimsAndAppealsGetDataMetaPagination,
  ClaimsAndAppealsList,
  FILE_REQUEST_STATUS,
  ScreenIDTypes,
} from 'store/api/types'
import { Asset } from 'react-native-image-picker'
import { ClaimType, ClaimTypeConstants } from 'screens/BenefitsScreen/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { DateTime } from 'luxon'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { Events, UserAnalytics } from 'constants/analytics'

import { SnackbarMessages } from 'components/SnackBar'
import { contentTypes } from 'store/api/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getAnalyticsTimers, logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange, isErrorObject, showSnackBar } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'

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
  return sortBy(claimsAndAppeals || [], (claimAndAppeal) => {
    return new Date(claimAndAppeal.attributes.updatedAt)
  }).reverse()
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
 * Redux action to get single claim
 */
export const getClaim =
  (id: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getClaim(id, screenID))))

    // // create a new signal for this api call so it can be aborted if a user leaves(goes back) to the previous screen
    const newAbortController = new AbortController()
    const signal = newAbortController.signal

    dispatch(dispatchStartGetClaim({ abortController: newAbortController }))

    try {
      const singleClaim = await api.get<api.ClaimGetData>(`/v0/claim/${id}`, {}, signal)

      if (singleClaim?.data) {
        const attributes = singleClaim.data.attributes
        await logAnalyticsEvent(Events.vama_claim_details_open(id, attributes.claimType, attributes.phase, attributes.phaseChangeDate || '', attributes.dateFiled))
      }

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_cap())
      const [totalTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_ttv_cap_details(totalTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishGetClaim({ claim: singleClaim?.data }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getClaim: ${claimsAndAppealsNonFatalErrorString}`)
        dispatch(dispatchFinishGetClaim({ claim: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to get single appeal
 */
export const getAppeal =
  (id: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppeal(id, screenID))))

    // create a new signal for this api call so it can be aborted if a user leaves(goes back) to the previous screen
    const newAbortController = new AbortController()
    const signal = newAbortController.signal

    dispatch(dispatchStartGetAppeal({ abortController: newAbortController }))
    try {
      const appeal = await api.get<api.AppealGetData>(`/v0/appeal/${id}`, {}, signal)
      const [totalTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_ttv_cap_details(totalTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_cap())
      await registerReviewEvent()
      dispatch(dispatchFinishGetAppeal({ appeal: appeal?.data }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getAppeal: ${claimsAndAppealsNonFatalErrorString}`)
        dispatch(dispatchFinishGetAppeal({ appeal: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to notify VA to make a claim decision
 */
export const submitClaimDecision =
  (claimID: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    const retryFunction = () => dispatch(submitClaimDecision(claimID, screenID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartSubmitClaimDecision())

    try {
      await api.post<ClaimDecisionResponseData>(`/v0/claim/${claimID}/request-decision`)

      dispatch(dispatchFinishSubmitClaimDecision())
      showSnackBar('Request sent', dispatch, undefined, true, false, true)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `submitClaimDecision: ${claimsAndAppealsNonFatalErrorString}`)
        dispatch(dispatchFinishSubmitClaimDecision(error))
        showSnackBar('Request could not be sent', dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Redux action to upload a file to a claim
 */
export const uploadFileToClaim =
  (claimID: string, messages: SnackbarMessages, request: ClaimEventData, files: Array<Asset> | Array<DocumentPickerResponse>, evidenceMethod: 'file' | 'photo'): AppThunk =>
  async (dispatch) => {
    const retryFunction = () => dispatch(uploadFileToClaim(claimID, messages, request, files, evidenceMethod))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartFileUpload())
    await logAnalyticsEvent(Events.vama_claim_upload_start(claimID, request.trackedItemId || null, request.type, evidenceMethod))
    try {
      if (files.length > 1) {
        const fileStrings = files.map((file: DocumentPickerResponse | Asset) => {
          return file.base64
        })

        const payload = JSON.parse(
          JSON.stringify({
            files: fileStrings,
            tracked_item_id: request.trackedItemId,
            document_type: request.documentType,
          }),
        )

        await api.post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents/multi-image`, payload as unknown as api.Params)
      } else {
        const formData = new FormData()
        const fileToUpload = files[0]
        let nameOfFile: string | undefined
        let typeOfFile: string | undefined
        let uriOfFile: string | undefined

        if ('fileSize' in fileToUpload) {
          const { fileName, type, uri } = fileToUpload
          nameOfFile = fileName
          typeOfFile = type
          uriOfFile = uri
        } else if ('size' in fileToUpload) {
          const { name, uri, type } = fileToUpload
          nameOfFile = name
          typeOfFile = type
          uriOfFile = uri
        }
        // TODO: figure out why backend-upload reads images as 1 MB more than our displayed size (e.g. 1.15 MB --> 2.19 MB)
        formData.append(
          'file',
          JSON.parse(
            JSON.stringify({
              name: nameOfFile || '',
              uri: uriOfFile || '',
              type: typeOfFile || '',
            }),
          ),
        )

        formData.append('trackedItemId', JSON.parse(JSON.stringify(request.trackedItemId)))
        formData.append('documentType', JSON.parse(JSON.stringify(request.documentType)))

        await api.post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents`, formData as unknown as api.Params, contentTypes.multipart)
      }
      await logAnalyticsEvent(Events.vama_claim_upload_compl(claimID, request.trackedItemId || null, request.type, evidenceMethod))

      dispatch(dispatchFinishFileUpload({ error: undefined, eventDescription: request.description, files, request }))
      showSnackBar(messages.successMsg, dispatch, undefined, true)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `uploadFileToClaim: ${claimsAndAppealsNonFatalErrorString}`)
        await logAnalyticsEvent(Events.vama_claim_upload_fail(claimID, request.trackedItemId || null, request.type, evidenceMethod))
        dispatch(dispatchFinishFileUpload({ error }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Redux action to signify the upload a file request was successful
 */
export const fileUploadSuccess = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFileUploadSuccess())
}

/**
 * Redux action to track when a user is on step 3 of claims and has a file request
 */
export const sendClaimStep3FileRequestAnalytics = (): AppThunk => async () => {
  await logAnalyticsEvent(Events.vama_claim_file_request())
}

// creates the documents array after submitting a file request
const createFileRequestDocumentsArray = (
  files: Array<Asset> | Array<DocumentPickerResponse>,
  trackedItemId: number | undefined,
  documentType: string,
  uploadDate: string,
): Array<ClaimEventDocumentData> => {
  return map(files, (item) => {
    let name: string | undefined

    if ('fileSize' in item) {
      name = item.fileName
    } else if ('size' in item) {
      name = item.name
    }

    const fileType = find(DocumentTypes526, (type) => {
      return type.value === documentType
    })

    return {
      trackedItemId,
      fileType: fileType ? fileType.label : '',
      filename: name,
      documentType,
      uploadDate,
    } as ClaimEventDocumentData
  })
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
      const activeList = activeData?.data || []
      const closedList = closedData?.data || []

      state.claimsServiceError = claimsServiceError
      state.appealsServiceError = appealsServiceError
      state.error = error
      state.loadingClaimsAndAppeals = false
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
      const claimsAndAppealsList = claimsAndAppeals?.data || []

      state.claimsServiceError = claimsServiceError
      state.appealsServiceError = appealsServiceError
      state.error = error
      state.loadingClaimsAndAppeals = false
      state.claimsAndAppealsByClaimType[claimType] = claimsAndAppealsList
      state.claimsAndAppealsMetaPagination[claimType] = claimsAndAppeals?.meta?.pagination || state.claimsAndAppealsMetaPagination[claimType]
      state.loadedClaimsAndAppeals[claimType] = claimsAndAppeals?.meta.dataFromStore ? curLoadedClaimsAndAppeals : curLoadedClaimsAndAppeals.concat(claimsAndAppealsList)
    },

    dispatchStartGetClaim: (state, action: PayloadAction<{ abortController: AbortController }>) => {
      state.loadingClaim = true
      state.cancelLoadingDetailScreen = action.payload.abortController
    },

    dispatchFinishGetClaim: (state, action: PayloadAction<{ claim?: ClaimData; error?: Error }>) => {
      const { claim, error } = action.payload

      state.claim = claim
      state.error = error
      state.loadingClaim = false
      state.cancelLoadingDetailScreen = undefined
    },

    dispatchStartGetAppeal: (state, action: PayloadAction<{ abortController: AbortController }>) => {
      state.loadingAppeal = true
      state.cancelLoadingDetailScreen = action.payload.abortController
    },

    dispatchFinishGetAppeal: (state, action: PayloadAction<{ appeal?: AppealData; error?: Error }>) => {
      const { appeal, error } = action.payload

      state.appeal = appeal
      state.error = error
      state.loadingAppeal = false
      state.cancelLoadingDetailScreen = undefined
    },

    dispatchStartSubmitClaimDecision: (state) => {
      state.loadingSubmitClaimDecision = true
    },

    dispatchFinishSubmitClaimDecision: (state, action: PayloadAction<Error | undefined>) => {
      const claim = state.claim

      if (claim) {
        claim.attributes.waiverSubmitted = true
      }

      state.error = action.payload
      state.claim = claim
      state.loadingSubmitClaimDecision = false
      state.submittedDecision = true
    },

    dispatchStartFileUpload: (state) => {
      state.loadingFileUpload = true
    },

    dispatchFinishFileUpload: (
      state,
      action: PayloadAction<{ error?: Error; eventDescription?: string; files?: Array<Asset> | Array<DocumentPickerResponse>; request?: ClaimEventData }>,
    ) => {
      const { error, eventDescription, files, request } = action.payload

      if (state.claim && !error) {
        const dateUploadedString = DateTime.local().toISO()
        const indexOfRequest = state.claim.attributes.eventsTimeline.findIndex((el) => el.description === eventDescription)
        state.claim.attributes.eventsTimeline[indexOfRequest].uploaded = true
        state.claim.attributes.eventsTimeline[indexOfRequest].status = FILE_REQUEST_STATUS.SUBMITTED_AWAITING_REVIEW

        state.claim.attributes.eventsTimeline[indexOfRequest].documents = createFileRequestDocumentsArray(
          files || [],
          request?.trackedItemId || undefined,
          request?.documentType || '',
          dateUploadedString,
        )
        state.claim.attributes.eventsTimeline[indexOfRequest].uploadDate = dateUploadedString
      }

      state.loadingFileUpload = false
      state.error = error
      state.fileUploadedFailure = !!error
      state.filesUploadedSuccess = !error
    },

    dispatchFileUploadSuccess: (state) => {
      state.fileUploadedFailure = false
      state.filesUploadedSuccess = false
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
  dispatchStartGetClaim,
  dispatchFinishGetClaim,
  dispatchFinishGetAppeal,
  dispatchStartGetAppeal,
  dispatchFinishSubmitClaimDecision,
  dispatchStartSubmitClaimDecision,
  dispatchFinishFileUpload,
  dispatchStartFileUpload,
  dispatchClearLoadedClaimsAndAppeals,
  dispatchFileUploadSuccess,
} = claimsAndAppealsSlice.actions
export default claimsAndAppealsSlice.reducer
