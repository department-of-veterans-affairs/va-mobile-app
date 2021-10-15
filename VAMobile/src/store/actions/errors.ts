import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { DateTime } from 'luxon'
import { DowntimeFeatureNameConstants, DowntimeFeatureToScreenID, MaintenanceWindowsGetData, ScreenIDTypes } from '../api/types'

export const dispatchSetError = (errorType?: CommonErrorTypes, screenID?: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
      screenID,
    },
  }
}

export const dispatchClearErrors = (screenID?: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ERRORS',
    payload: {
      screenID,
    },
  }
}

export const dispatchSetTryAgainFunction = (tryAgain: () => Promise<void>): ReduxAction => {
  return {
    type: 'ERRORS_SET_TRY_AGAIN_FUNCTION',
    payload: {
      tryAgain,
    },
  }
}

/**
 * Sets the error metadata for a given screen ID. Currently only utilized for downtime messages
 * @param metadata - Any key value pair of data
 * @param screenID - ID of the screen with the error
 */
export const dispatchSetMetadata = (metadata?: { [key: string]: string }, screenID?: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_SET_METADATA',
    payload: {
      metadata,
      screenID,
    },
  }
}

/**
 * Clears the error metadata for a given screen ID
 * @param screenID - screen ID of the screen to clear
 */
export const dispatchClearMetadata = (screenID?: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_METADATA',
    payload: {
      screenID,
    },
  }
}

/**
 * Clears the error metadata for all screen IDs
 */
export const dispatchClearAllMetadata = (): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ALL_METADATA',
    payload: null,
  }
}

/**
 * Clears the error type for all screen IDs
 */
export const dispatchClearErrorType = (errorType: CommonErrorTypes): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ERROR_TYPE',
    payload: {
      errorType,
    },
  }
}

/**
 * checks for downtime by getting a list from the backend API
 * clears all metadata and current downtimes first and sets errors based on which downtime is active from API call
 */
export const dispatchCheckForDowntimeErrors = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const response = await api.get<MaintenanceWindowsGetData>('/v0/maintenance_windows')
    if (!response) {
      return
    }
    dispatch(dispatchClearAllMetadata())
    dispatch(dispatchClearErrorType(CommonErrorTypesConstants.DOWNTIME_ERROR))
    const maint_windows = response.data.filter((w) => DateTime.fromISO(w.startTime) <= DateTime.now() && !!DowntimeFeatureToScreenID[w.service])
    for (const maint_window of maint_windows) {
      const screenID = DowntimeFeatureToScreenID[maint_window.service]
      if (!screenID) {
        continue
      }
      const metadata = {
        featureName: '',
        endTime: '',
      }
      metadata.featureName = DowntimeFeatureNameConstants[maint_window.service]
      metadata.endTime = DateTime.fromISO(maint_window.endTime).toFormat('fff')
      dispatch(dispatchSetMetadata(metadata, screenID))
      dispatch(dispatchSetError(CommonErrorTypesConstants.DOWNTIME_ERROR, screenID))
    }
  }
}
