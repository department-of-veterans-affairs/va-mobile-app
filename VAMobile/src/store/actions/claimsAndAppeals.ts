import * as api from '../api'
import {
  AppealData,
  ClaimData,
  ClaimEventData,
  ClaimsAndAppealsErrorServiceTypesConstants,
  ClaimsAndAppealsGetDataMetaError,
  ClaimsAndAppealsList,
  ScreenIDTypes,
} from '../api/types'
import { AsyncReduxAction, ReduxAction } from '../types'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ClaimType } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { DocumentPickerResponse } from '../../screens/ClaimsScreen/ClaimsStackScreens'

import { DateTime } from 'luxon'
import { ImagePickerResponse } from 'react-native-image-picker'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

const dispatchStartGetAllClaimsAndAppeals = (): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_START_GET_ALL',
    payload: {},
  }
}

const dispatchFinishAllClaimsAndAppeals = (
  claimsAndAppealsList?: ClaimsAndAppealsList,
  claimsAndAppealsMetaErrors?: Array<ClaimsAndAppealsGetDataMetaError>,
  error?: Error,
): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_FINISH_GET_ALL',
    payload: {
      claimsAndAppealsList,
      claimsAndAppealsMetaErrors,
      error,
    },
  }
}

/**
 * Redux action to get all claims and appeals
 */
export const getAllClaimsAndAppeals = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getAllClaimsAndAppeals(screenID))))
    dispatch(dispatchStartGetAllClaimsAndAppeals())

    try {
      // TODO mock errors. Remove ##19175
      const claimsAndAppealsList: ClaimsAndAppealsList = [
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

      let claimsAndAppeals: api.ClaimsAndAppealsGetData | undefined = {
        data: claimsAndAppealsList,
      }
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      // claims and appeals unavailable
      if (signInEmail === 'vets.gov.user+1414@gmail.com') {
        claimsAndAppeals.meta = {
          errors: [
            {
              service: ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS,
            },
            {
              service: ClaimsAndAppealsErrorServiceTypesConstants.APPEALS,
            },
          ],
        }
      } else if (signInEmail === 'vets.gov.user+1402@gmail.com') {
        // appeals unavailable with no claims
        claimsAndAppeals.meta = {
          errors: [
            {
              service: ClaimsAndAppealsErrorServiceTypesConstants.APPEALS,
            },
          ],
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
        }
        claimsAndAppeals.data = claimsAndAppeals.data.filter((item) => {
          return item.type === 'appeal'
        })
      } else if (signInEmail === 'vets.gov.user+366@gmail.com') {
        // claims unavailable with no appeals
        claimsAndAppeals.meta = {
          errors: [
            {
              service: ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS,
            },
          ],
        }
        claimsAndAppeals.data = claimsAndAppeals.data.filter((item) => {
          return item.type === 'appeal'
        })
        claimsAndAppeals.data = []
      } else {
        claimsAndAppeals = await api.get<api.ClaimsAndAppealsGetData>('/v0/claims-and-appeals-overview')
      }

      dispatch(dispatchFinishAllClaimsAndAppeals(claimsAndAppeals?.data, claimsAndAppeals?.meta?.errors))
    } catch (error) {
      dispatch(dispatchFinishAllClaimsAndAppeals(undefined, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchGetActiveOrClosedClaimsAndAppeals = (claimType: ClaimType): ReduxAction => {
  return {
    type: 'CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED',
    payload: {
      claimType,
    },
  }
}

/**
 * Redux action to get all active claims and appeals or all closed claims and appeals
 */
export const getActiveOrClosedClaimsAndAppeals = (claimType: ClaimType): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchGetActiveOrClosedClaimsAndAppeals(claimType))
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
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getClaim(id, screenID))))
    dispatch(dispatchStartGetClaim())

    try {
      const claim = await api.get<api.ClaimGetData>(`/v0/claim/${id}`)
      dispatch(dispatchFinishGetClaim(claim?.data))
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
