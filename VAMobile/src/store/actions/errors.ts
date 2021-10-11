import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { DateTime } from 'luxon'
import { DowntimeFeatureNameConstants, DowntimeFeatureToScreenID, MaintenanceWindowsGetData, ScreenIDTypes } from '../api'

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
 * checks for downtime by getting a list from the backend API
 * clears all metadata first and sets errors based on which downtime is active
 */
export const dispatchCheckForDowntimeErrors = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const response = await api.get<MaintenanceWindowsGetData>('/v0/maintenance_windows')
    if (!response) {
      return
    }
    dispatch(dispatchClearAllMetadata())
    for (const maint_window of response) {
      const screenID = DowntimeFeatureToScreenID[maint_window.service]
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
