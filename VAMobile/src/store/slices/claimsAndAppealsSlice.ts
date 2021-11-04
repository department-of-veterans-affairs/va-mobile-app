import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import _ from 'underscore'

import * as api from '../api'
import { AppThunk } from 'store'
import { appeal as Appeal } from 'screens/ClaimsScreen/appealData'
import {
  AppealData,
  ClaimData,
  ClaimDecisionResponseData,
  ClaimDocUploadData,
  ClaimEventData,
  ClaimsAndAppealsErrorServiceTypesConstants,
  ClaimsAndAppealsGetData,
  ClaimsAndAppealsGetDataMetaPagination,
  ClaimsAndAppealsList,
  ScreenIDTypes,
  contentTypes,
} from '../api'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ClaimType, ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { DateTime } from 'luxon'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { Events, UserAnalytics } from 'constants/analytics'
import { ImagePickerResponse } from 'react-native-image-picker'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange, isErrorObject } from 'utils/common'
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

// const emptyClaimsAndAppealsGetData: api.ClaimsAndAppealsGetData = {
//   data: [],
//   meta: {
//     dataFromStore: false,
//     errors: [],
//     pagination: {
//       totalEntries: 0,
//       currentPage: 1,
//       perPage: DEFAULT_PAGE_SIZE,
//     },
//   },
// }

export const prefetchClaimsAndAppeals =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchClaimsAndAppeals(screenID))))
    dispatch(dispatchStartPrefetchGetClaimsAndAppeals())

    try {
      // TODO mock errors. Remove ##19175
      const activeClaimsAndAppealsList: ClaimsAndAppealsList = [
        {
          id: '1',
          type: 'appeal',
          attributes: {
            subtype: 'supplementalClaim',
            completed: false,
            dateFiled: '2020-10-22',
            updatedAt: '2020-10-28',
            displayTitle: 'supplemental claim for disability compensation',
          },
        },
        {
          id: '0',
          type: 'claim',
          attributes: {
            subtype: 'Disability',
            completed: false,
            dateFiled: '2020-11-13',
            updatedAt: '2020-11-30',
            displayTitle: 'Disability',
          },
        },
        {
          id: '4',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: false,
            dateFiled: '2020-06-11',
            updatedAt: '2020-12-07',
            displayTitle: 'Compensation',
          },
        },
      ]

      const closedClaimsAndAppealsList: ClaimsAndAppealsList = [
        {
          id: '2',
          type: 'appeal',
          attributes: {
            subtype: 'Disability',
            completed: true,
            dateFiled: '2020-07-24',
            updatedAt: '2020-09-15',
            displayTitle: 'Disability',
          },
        },
        {
          id: '3',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: true,
            dateFiled: '2020-11-18',
            updatedAt: '2020-12-05',
            displayTitle: 'Compensation',
          },
        },
      ]

      const mockMeta = {
        dataFromStore: false,
        errors: [],
        pagination: {
          totalEntries: 0,
          currentPage: 1,
          perPage: DEFAULT_PAGE_SIZE,
        },
      }

      let activeClaimsAndAppeals: api.ClaimsAndAppealsGetData | undefined = {
        data: activeClaimsAndAppealsList,
        meta: { ...mockMeta },
      }

      let closedClaimsAndAppeals: api.ClaimsAndAppealsGetData | undefined = {
        data: closedClaimsAndAppealsList,
        meta: { ...mockMeta },
      }

      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      // simulate common error try again
      if (signInEmail === 'vets.gov.user+1414@gmail.com') {
        throw {
          status: 503,
        }
      } else if (signInEmail === 'vets.gov.user+1402@gmail.com') {
        // appeals unavailable with no claims
        activeClaimsAndAppeals.meta = {
          dataFromStore: false,
          errors: [
            {
              service: ClaimsAndAppealsErrorServiceTypesConstants.APPEALS,
            },
          ],
          pagination: {
            currentPage: 1,
            totalEntries: 1,
            perPage: 10,
          },
        }
        closedClaimsAndAppeals.meta = activeClaimsAndAppeals.meta
        activeClaimsAndAppeals.data = []
        closedClaimsAndAppeals.data = []
      } else if (signInEmail === 'vets.gov.user+1401@gmail.com') {
        // claims unavailable with appeals
        activeClaimsAndAppeals.meta = {
          dataFromStore: false,
          errors: [
            {
              service: ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS,
            },
          ],
          pagination: {
            currentPage: 1,
            totalEntries: 1,
            perPage: 10,
          },
        }
        activeClaimsAndAppeals.data = activeClaimsAndAppeals.data.filter((item) => {
          return item.type === 'appeal'
        })
        closedClaimsAndAppeals.data = closedClaimsAndAppeals.data.filter((item) => {
          return item.type === 'appeal'
        })
      } else if (signInEmail !== 'vets.gov.user+366@gmail.com') {
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
      }

      dispatch(dispatchFinishPrefetchGetClaimsAndAppeals({ active: activeClaimsAndAppeals, closed: closedClaimsAndAppeals }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishPrefetchGetClaimsAndAppeals({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

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
        dispatch(dispatchFinishAllClaimsAndAppeals({ claimType, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const getClaim =
  (id: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getClaim(id, screenID))))
    dispatch(dispatchStartGetClaim())

    try {
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''

      // TODO: remove once file upload flow checked
      let singleClaim
      if (signInEmail === 'vets.gov.user+366@gmail.com') {
        singleClaim = {
          data: Claim,
        }
      } else {
        singleClaim = await api.get<api.ClaimGetData>(`/v0/claim/${id}`)
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
        dispatch(dispatchFinishGetClaim({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const getAppeal =
  (id: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppeal(id, screenID))))
    dispatch(dispatchStartGetAppeal())
    try {
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      let appeal
      if (signInEmail === 'vets.gov.user+226@gmail.com') {
        appeal = {
          data: Appeal,
        }
      } else {
        appeal = await api.get<api.AppealGetData>(`/v0/appeal/${id}`)
      }

      const [totalTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_ttv_cap_details(totalTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_cap())
      await registerReviewEvent()
      dispatch(dispatchFinishGetAppeal({ appeal: appeal?.data }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetAppeal({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const submitClaimDecision =
  (claimID: string, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(submitClaimDecision(claimID, screenID))))
    dispatch(dispatchStartSubmitClaimDecision())

    try {
      await api.post<ClaimDecisionResponseData>(`/v0/claim/${claimID}/request-decision`)

      dispatch(dispatchFinishSubmitClaimDecision())
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishSubmitClaimDecision(error))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const uploadFileToClaim =
  (claimID: string, request: ClaimEventData, files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchStartFileUpload())

    try {
      if (files.length > 1) {
        const fileStrings = files.map((file: DocumentPickerResponse | ImagePickerResponse) => {
          if ('assets' in file) {
            return file.assets ? file.assets[0].base64 : undefined
          } else if ('size' in file) {
            return file.base64
          }
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

        if ('assets' in fileToUpload) {
          if (fileToUpload.assets && fileToUpload.assets.length > 0) {
            const { fileName, type, uri } = fileToUpload.assets[0]
            nameOfFile = fileName
            typeOfFile = type
            uriOfFile = uri
          }
        } else if ('size' in fileToUpload) {
          const { name, uri, type } = fileToUpload
          nameOfFile = name
          typeOfFile = type
          uriOfFile = uri
        }
        // TODO: figure out why backend-upload reads images as 1 MB more than our displayed size (e.g. 1.15 MB --> 2.19 MB)
        formData.append(
          'uploads[]',
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

      dispatch(dispatchFinishFileUpload({ eventDescription: request.description }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishFileUpload({ error }))
      }
    }
  }

export const fileUploadSuccess = (): AppThunk => async (dispatch) => {
  dispatch(dispatchFileUploadSuccess())
}

const claimsAndAppealsSlice = createSlice({
  name: 'claimsAndAppeals',
  initialState: initialClaimsAndAppealsState,
  reducers: {
    dispatchStartPrefetchGetClaimsAndAppeals: (state) => {
      state.loadingClaimsAndAppeals = true
    },

    dispatchFinishPrefetchGetClaimsAndAppeals: (state, action: PayloadAction<{ active?: ClaimsAndAppealsGetData; closed?: ClaimsAndAppealsGetData; error?: Error }>) => {
      const { active, closed, error } = action.payload
      const activeMetaErrors = active?.meta?.errors || []
      const closedMetaErrors = closed?.meta?.errors || []
      const activeAndClosedMetaErrors = [...activeMetaErrors, ...closedMetaErrors]
      const claimsServiceError = !!activeAndClosedMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
      const appealsServiceError = !!activeAndClosedMetaErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)
      const curLoadedActive = state.loadedClaimsAndAppeals.ACTIVE
      const curLoadedClosed = state.loadedClaimsAndAppeals.CLOSED
      const activeList = active?.data || []
      const closedList = closed?.data || []

      return {
        ...state,
        claimsServiceError,
        appealsServiceError,
        error,
        loadingClaimsAndAppeals: false,
        claimsAndAppealsByClaimType: {
          ...state.claimsAndAppealsByClaimType,
          ACTIVE: activeList,
          CLOSED: closedList,
        },
        claimsAndAppealsMetaPagination: {
          ...state.claimsAndAppealsMetaPagination,
          ACTIVE: active?.meta?.pagination || state.claimsAndAppealsMetaPagination.ACTIVE,
          CLOSED: closed?.meta?.pagination || state.claimsAndAppealsMetaPagination.CLOSED,
        },
        loadedClaimsAndAppeals: {
          ...state.loadedClaimsAndAppeals,
          ACTIVE: active?.meta.dataFromStore ? curLoadedActive : curLoadedActive.concat(activeList),
          CLOSED: closed?.meta.dataFromStore ? curLoadedClosed : curLoadedClosed.concat(closedList),
        },
      }
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

    dispatchStartGetClaim: (state) => {
      state.loadingClaim = true
    },

    dispatchFinishGetClaim: (state, action: PayloadAction<{ claim?: ClaimData; error?: Error }>) => {
      const { claim, error } = action.payload

      state.claim = claim
      state.error = error
      state.loadingClaim = false
    },

    dispatchStartGetAppeal: (state) => {
      state.loadingAppeal = true
    },

    dispatchFinishGetAppeal: (state, action: PayloadAction<{ appeal?: AppealData; error?: Error }>) => {
      const { appeal, error } = action.payload

      state.appeal = appeal
      state.error = error
      state.loadingAppeal = false
    },

    dispatchStartSubmitClaimDecision: (state) => {
      state.loadingSubmitClaimDecision = true
    },

    dispatchFinishSubmitClaimDecision: (state, action: PayloadAction<Error | undefined>) => {
      const claim = state.claim

      if (claim) {
        claim.attributes.waiverSubmitted = true
      }

      return {
        ...state,
        error: action.payload,
        claim,
        loadingSubmitClaimDecision: false,
        submittedDecision: true,
      }
    },

    dispatchStartFileUpload: (state) => {
      state.loadingFileUpload = true
    },

    dispatchFinishFileUpload: (state, action: PayloadAction<{ error?: Error; eventDescription?: string }>) => {
      const { error, eventDescription } = action.payload
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
