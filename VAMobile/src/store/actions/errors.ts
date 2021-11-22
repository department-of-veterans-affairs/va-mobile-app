import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { DateTime } from 'luxon'
import { DowntimeFeatureNameConstants, DowntimeFeatureToScreenID, MaintenanceWindowsGetData, ScreenIDTypes } from '../api/types'
import { DowntimeWindow, DowntimeWindowsByScreenIDType, ErrorsByScreenIDType } from 'store'

export const dispatchSetError = (errorType?: CommonErrorTypes, screenID?: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERROR',
    payload: {
      errorType,
      screenID,
    },
  }
}

export const dispatchSetErrors = (errors: ErrorsByScreenIDType): ReduxAction => {
  return {
    type: 'ERRORS_SET_ERRORS',
    payload: {
      errors,
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
 */
export const dispatchSetDowntime = (downtimeWindows: DowntimeWindowsByScreenIDType): ReduxAction => {
  return {
    type: 'ERRORS_SET_DOWNTIME',
    payload: {
      downtimeWindows,
    },
  }
}

/**
 * Clears the error metadata for a given screen ID
 * @param screenID - screen ID of the screen to clear
 */
export const dispatchClearDowntime = (screenID?: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_DOWNTIME',
    payload: {
      screenID,
    },
  }
}

/**
 * Clears the error metadata for all screen IDs
 */
export const dispatchClearAllDowntime = (): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ALL_DOWNTIME',
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
 * Clears the error type for a screen ID
 */
export const dispatchClearErrorTypeByScreen = (errorType: CommonErrorTypes, screenID: ScreenIDTypes): ReduxAction => {
  return {
    type: 'ERRORS_CLEAR_ERROR_TYPE_BY_SCREEN',
    payload: {
      errorType,
      screenID,
    },
  }
}

/**
 * checks for downtime by getting a list from the backend API
 * clears all metadata and current downtimes first and sets errors based on which downtime is active from API call
 */
export const checkForDowntimeErrors = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const response = await api.get<MaintenanceWindowsGetData>('/v0/maintenance_windows')
    if (!response) {
      return
    }
    dispatch(dispatchClearAllDowntime())
    dispatch(dispatchClearErrorType(CommonErrorTypesConstants.DOWNTIME_ERROR))
    // filtering out any maintenance windows we haven't mapped to a screen in the app
    const maintWindows = response.data.filter((w) => !!DowntimeFeatureToScreenID[w.attributes.service])
    let downtimeWindows = _getState().errors.downtimeWindowsByScreenID
    for (const m of maintWindows) {
      const maintWindow = m.attributes
      const screenID = DowntimeFeatureToScreenID[maintWindow.service]
      const metadata: DowntimeWindow = {
        featureName: DowntimeFeatureNameConstants[maintWindow.service],
        startTime: DateTime.fromISO(maintWindow.startTime),
        endTime: DateTime.fromISO(maintWindow.endTime),
      }
      downtimeWindows = {
        ...downtimeWindows,
        [screenID]: metadata,
      }
    }
    dispatch(dispatchSetDowntime(downtimeWindows))
    dispatch(updateCurrentDowntimes())
  }
}

export const updateCurrentDowntimes = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const metadata = _getState().errors.downtimeWindowsByScreenID
    let errors = _getState().errors.errorsByScreenID
    for (const [screenID, data] of Object.entries(metadata).filter(([, v]) => !!v)) {
      const { startTime, endTime } = data
      if (startTime < DateTime.now() && DateTime.now() < endTime && !errors[screenID as ScreenIDTypes]) {
        errors = {
          ...errors,
          [screenID as ScreenIDTypes]: CommonErrorTypesConstants.DOWNTIME_ERROR,
        }
      } else {
        errors = {
          ...errors,
          [screenID as ScreenIDTypes]: errors[screenID as ScreenIDTypes],
        }
      }
    }
    dispatch(dispatchSetErrors(errors))
  }
}
