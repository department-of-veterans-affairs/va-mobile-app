import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { MaintenanceWindowsGetData, ScreenIDTypes, DowntimeFeatureToScreenID, MaintenanceWindowsEntry } from '../api'

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

export const dispatchCheckForDowntimeErrors = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const response = await api.get<MaintenanceWindowsGetData>('/v0/maintenance_windows')
    if (!response) return
    for(let maint_window of response) {
      let screenID = DowntimeFeatureToScreenID[maint_window.service]
      dispatch(dispatchSetError(CommonErrorTypesConstants.DOWNTIME_ERROR, screenID))
    }
  }
}
