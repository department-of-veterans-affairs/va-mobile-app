import { ImagePickerResponse } from 'react-native-image-picker'
import _ from 'underscore'

import * as api from '../api'
import { appeal as Appeal } from 'screens/ClaimsScreen/appealData'
import {
  AppealData,
  ClaimData,
  ClaimDecisionResponseData,
  ClaimDocUploadData,
  ClaimEventData,
  ClaimsAndAppealsErrorServiceTypesConstants,
  ClaimsAndAppealsGetData,
  ClaimsAndAppealsList,
  ScreenIDTypes,
} from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ClaimType, ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'

import { ClaimsAndAppealsListType, ClaimsAndAppealsMetaPaginationType } from 'store/reducers'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { DocumentPickerResponse } from '../../screens/ClaimsScreen/ClaimsStackScreens'
import { Events, UserAnalytics } from 'constants/analytics'
import { contentTypes } from 'store/api/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getItemsInRange } from 'utils/common'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analytics'

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

const dispatchStartPrefetchGetClaimsAndAppeals = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_PREFETCH_GET',
    payload: {},
  }
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

const dispatchFinishPrefetchGetClaimsAndAppeals = (active?: ClaimsAndAppealsGetData, closed?: ClaimsAndAppealsGetData, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET',
    payload: {
      active: active || emptyClaimsAndAppealsGetData,
      closed: closed || emptyClaimsAndAppealsGetData,
      error,
    },
  }
}

/**
 * Redux action to prefetch claims and appeals
 */
export const prefetchClaimsAndAppeals = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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

      dispatch(dispatchFinishPrefetchGetClaimsAndAppeals(activeClaimsAndAppeals, closedClaimsAndAppeals))
    } catch (error) {
      dispatch(dispatchFinishPrefetchGetClaimsAndAppeals(undefined, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetAllClaimsAndAppeals = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET',
    payload: {},
  }
}

const dispatchFinishAllClaimsAndAppeals = (claimType: ClaimType, claimsAndAppeals?: ClaimsAndAppealsGetData, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET',
    payload: {
      claimsAndAppeals,
      claimType,
      error,
    },
  }
}

/**
 * Redux action to get all claims and appeals
 */
export const getClaimsAndAppeals = (claimType: ClaimType, screenID?: ScreenIDTypes, page = 1): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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

      dispatch(dispatchFinishAllClaimsAndAppeals(claimType, claimsAndAppeals))
    } catch (error) {
      dispatch(dispatchFinishAllClaimsAndAppeals(claimType, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetClaim = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM',
    payload: {},
  }
}

const dispatchFinishGetClaim = (claim?: ClaimData, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM',
    payload: {
      claim,
      error,
    },
  }
}

/**
 * Redux action to get single claim
 */
export const getClaim = (id: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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
      dispatch(dispatchFinishGetClaim(singleClaim?.data))
    } catch (error) {
      dispatch(dispatchFinishGetClaim(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetAppeal = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET_APPEAL',
    payload: {},
  }
}

const dispatchFinishGetAppeal = (appeal?: AppealData, error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET_APPEAL',
    payload: {
      appeal,
      error,
    },
  }
}

/**
 * Redux action to get single appeal
 */
export const getAppeal = (id: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_cap())
      dispatch(dispatchFinishGetAppeal(appeal?.data))
    } catch (error) {
      dispatch(dispatchFinishGetAppeal(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartSubmitClaimDecision = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION',
    payload: {},
  }
}

const dispatchFinishSubmitClaimDecision = (error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION',
    payload: {
      error,
    },
  }
}

/**
 * Redux action to notify VA to make a claim decision
 */
export const submitClaimDecision = (claimID: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(submitClaimDecision(claimID, screenID))))
    dispatch(dispatchStartSubmitClaimDecision())

    try {
      await api.post<ClaimDecisionResponseData>(`/v0/claim/${claimID}/request-decision`)

      dispatch(dispatchFinishSubmitClaimDecision())
    } catch (error) {
      dispatch(dispatchFinishSubmitClaimDecision(error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartFileUpload = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_FILE_UPLOAD',
    payload: {},
  }
}

const dispatchFinishFileUpload = (error?: Error, eventDescription?: string): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD',
    payload: {
      error,
      eventDescription,
    },
  }
}

/**
 * Redux action to upload a file to a claim
 */
export const uploadFileToClaim = (claimID: string, request: ClaimEventData, files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartFileUpload())

    try {
      if (files.length > 1) {
        const fileStrings = _.compact(_.pluck(files, 'base64'))

        const payload = {
          files: fileStrings,
          tracked_item_id: request.trackedItemId,
          document_type: request.documentType,
        }

        await api.post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents/multi-image`, (payload as unknown) as api.Params)
      } else {
        const formData = new FormData()
        const fileToUpload = files[0]

        formData.append('file', {
          name: (fileToUpload as ImagePickerResponse).fileName || (fileToUpload as DocumentPickerResponse).name || '',
          uri: fileToUpload.uri || '',
          type: fileToUpload.type || '',
        })

        formData.append('trackedItemId', request.trackedItemId)
        formData.append('documentType', request.documentType)

        await api.post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents`, (formData as unknown) as api.Params, contentTypes.multipart)
      }

      dispatch(dispatchFinishFileUpload(undefined, request.description))
    } catch (error) {
      dispatch(dispatchFinishFileUpload(error))
    }
  }
}

const dispatchFileUploadSuccess = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS',
    payload: {},
  }
}

/**
 * Redux action to signify the upload a file request was successful
 */
export const fileUploadSuccess = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchFileUploadSuccess())
  }
}

export const dispatchClearLoadedClaimsAndAppeals = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_CLEAR_LOADED_CLAIMS_AND_APPEALS',
    payload: {},
  }
}
