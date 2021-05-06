import * as api from '../api'
import { AppealData, ClaimData, ClaimEventData, ClaimsAndAppealsErrorServiceTypesConstants, ClaimsAndAppealsGetData, ClaimsAndAppealsList, ScreenIDTypes } from '../api/types'
import { AsyncReduxAction, ReduxAction } from '../types'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ClaimType, ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { DocumentPickerResponse } from '../../screens/ClaimsScreen/ClaimsStackScreens'

import { ClaimsAndAppealsListType, ClaimsAndAppealsMetaPaginationType } from 'store/reducers'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { DateTime } from 'luxon'
import { ImagePickerResponse } from 'react-native-image-picker'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

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

// Return data that looks like ClaimsAndAppealsGetData if data was loaded previously otherwise null
const getLoadedClaimsAndAppeals = (
  claimType: ClaimType,
  latestPage: number,
  pageSize: number,
  loadedClaimsAndAppeals: ClaimsAndAppealsListType,
  paginationMetaData: ClaimsAndAppealsMetaPaginationType,
) => {
  // get begin and end index to check if we have the items already and for slicing
  const claimsAndAppeals = loadedClaimsAndAppeals[claimType]
  const beginIdx = (latestPage - 1) * pageSize
  const endIdx = latestPage * pageSize

  // do we have the claimsAndAppeals?
  if (beginIdx < claimsAndAppeals.length) {
    return {
      data: claimsAndAppeals.slice(beginIdx, endIdx),
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
 * Redux action to get all claims and appeals
 */
export const getClaimsAndAppeals = (page: number, claimType: ClaimType, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getClaimsAndAppeals(page, claimType, screenID))))
    dispatch(dispatchStartGetAllClaimsAndAppeals())

    try {
      // TODO mock errors. Remove ##19175
      const activeClaimsAndAppealsList: ClaimsAndAppealsList = [
        {
          id: '1',
          type: 'appeal',
          attributes: {
            subtype: 'Compensation',
            completed: false,
            dateFiled: '2020-10-22T20:15:14.000+00:00',
            updatedAt: '2020-10-28T20:15:14.000+00:00',
          },
        },
        {
          id: '0',
          type: 'claim',
          attributes: {
            subtype: 'Disability',
            completed: false,
            dateFiled: '2020-11-13T20:15:14.000+00:00',
            updatedAt: '2020-11-30T20:15:14.000+00:00',
          },
        },
        {
          id: '4',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: false,
            dateFiled: '2020-06-11T20:15:14.000+00:00',
            updatedAt: '2020-12-07T20:15:14.000+00:00',
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
            dateFiled: '2020-07-24T20:15:14.000+00:00',
            updatedAt: '2020-09-15T20:15:14.000+00:00',
          },
        },
        {
          id: '3',
          type: 'claim',
          attributes: {
            subtype: 'Compensation',
            completed: true,
            dateFiled: '2020-11-18T20:15:14.000+00:00',
            updatedAt: '2020-12-05T20:15:14.000+00:00',
          },
        },
      ]

      const isActive = claimType === ClaimTypeConstants.ACTIVE
      let claimsAndAppeals: api.ClaimsAndAppealsGetData | undefined = {
        data: isActive ? activeClaimsAndAppealsList : closedClaimsAndAppealsList,
        meta: {
          errors: [],
          pagination: {
            totalEntries: 0,
            currentPage: 1,
            perPage: DEFAULT_PAGE_SIZE,
          },
        },
      }

      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      // simulate common error try again
      if (signInEmail === 'vets.gov.user+1414@gmail.com') {
        throw {
          status: 503,
        }
      } else if (signInEmail === 'vets.gov.user+1402@gmail.com') {
        // appeals unavailable with no claims
        claimsAndAppeals.meta = {
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
        claimsAndAppeals.data = []
      } else if (signInEmail === 'vets.gov.user+1401@gmail.com') {
        // claims unavailable with appeals
        claimsAndAppeals.meta = {
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
        claimsAndAppeals.data = claimsAndAppeals.data.filter((item) => {
          return item.type === 'appeal'
        })
      } else if (signInEmail !== 'vets.gov.user+366@gmail.com') {
        const { claimsAndAppealsMetaPagination, loadedClaimsAndAppeals: loadedItems } = getState().claimsAndAppeals
        const loadedClaimsAndAppeals = getLoadedClaimsAndAppeals(claimType, page, DEFAULT_PAGE_SIZE, loadedItems, claimsAndAppealsMetaPagination)
        if (loadedClaimsAndAppeals) {
          claimsAndAppeals = loadedClaimsAndAppeals
        } else {
          claimsAndAppeals = await api.get<api.ClaimsAndAppealsGetData>('/v0/claims-and-appeals-overview', {
            'page[number]': page.toString(),
            'page[size]': DEFAULT_PAGE_SIZE.toString(),
            showCompleted: isActive ? 'false' : 'true',
          })
        }
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
    dispatch(dispatchClearErrors())
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
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppeal(id, screenID))))
    dispatch(dispatchStartGetAppeal())
    try {
      const appeal = await api.get<api.AppealGetData>(`/v0/appeal/${id}`)
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
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(submitClaimDecision(claimID, screenID))))
    dispatch(dispatchStartSubmitClaimDecision())

    try {
      // TODO: use endpoint when available
      console.log('Claim ID: ', claimID)

      Claim.attributes.waiverSubmitted = true

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

const dispatchFinishFileUpload = (error?: Error): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD',
    payload: {
      error,
    },
  }
}

/**
 * Redux action to upload a file to a claim
 */
export const uploadFileToClaim = (
  claimID: string,
  request: ClaimEventData,
  files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>,
  screenID?: ScreenIDTypes,
): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(uploadFileToClaim(claimID, request, files, screenID))))
    dispatch(dispatchStartFileUpload())

    try {
      // TODO: use endpoint when available
      console.log('Claim ID: ', claimID, ' request name: ', request.displayName, ' files list length: ', files.length)
      const indexOfRequest = Claim.attributes.eventsTimeline.findIndex((el) => el.description === request.description)
      Claim.attributes.eventsTimeline[indexOfRequest].uploaded = true
      Claim.attributes.eventsTimeline[indexOfRequest].uploadDate = DateTime.local().toISO()

      dispatch(dispatchFinishFileUpload())
    } catch (error) {
      dispatch(dispatchFinishFileUpload(error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
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
