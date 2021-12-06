import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes } from 'constants/errors'
import { DateTime } from 'luxon'
import { DowntimeFeatureNameConstants, DowntimeFeatureToScreenID, MaintenanceWindowsGetData, ScreenIDTypes } from '../api/types'
import { DowntimeWindow, DowntimeWindowsByFeatureType } from 'store'

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
 */
export const dispatchSetDowntime = (downtimeWindows: DowntimeWindowsByFeatureType): ReduxAction => {
  return {
    type: 'ERRORS_SET_DOWNTIME',
    payload: {
      downtimeWindows,
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

    // filtering out any maintenance windows we haven't mapped to a screen in the app
    const maintWindows = response.data.filter((w) => !!DowntimeFeatureToScreenID[w.attributes.service])
    let downtimeWindows = {} as DowntimeWindowsByFeatureType
    for (const m of maintWindows) {
      const maintWindow = m.attributes
      const metadata: DowntimeWindow = {
        featureName: DowntimeFeatureNameConstants[maintWindow.service],
        startTime: DateTime.fromISO(maintWindow.startTime),
        endTime: DateTime.fromISO(maintWindow.endTime),
      }
      downtimeWindows = {
        ...downtimeWindows,
        [maintWindow.service]: metadata,
      }
    }
    dispatch(dispatchSetDowntime(downtimeWindows))
  }
}
