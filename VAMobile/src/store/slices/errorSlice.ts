import { DateTime } from 'luxon'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { reduce } from 'underscore'

import { AppThunk } from 'store'
import { CommonErrorTypes } from 'constants/errors'
import { DowntimeFeatureNameConstants, DowntimeFeatureToScreenID, MaintenanceWindowsGetData, ScreenIDTypes, get, DowntimeFeatureTypeConstants, DowntimeFeatureType } from '../api'
import { ScreenIDTypesConstants } from '../api/types/Screens'

export type ErrorsByScreenIDType = {
  [key in ScreenIDTypes]?: CommonErrorTypes
}

export type DowntimeWindowsByFeatureType = {
  [key in DowntimeFeatureType]?: DowntimeWindow
}

export type DowntimeWindow = {
  featureName: string
  startTime: DateTime
  endTime: DateTime
}

export type ErrorsState = {
  errorsByScreenID: ErrorsByScreenIDType
  downtimeWindowsByFeature: DowntimeWindowsByFeatureType
  tryAgain: () => Promise<void>
}

export const initializeErrorsByScreenID = (): ErrorsByScreenIDType => {
  return reduce(
    ScreenIDTypesConstants,
    (memo: ErrorsByScreenIDType, value: ScreenIDTypes): ErrorsByScreenIDType => {
      memo[value] = undefined
      return memo
    },
    {} as ErrorsByScreenIDType,
  )
}

export const initializeDowntimeWindowsByFeature = (): DowntimeWindowsByFeatureType => {
  return reduce(
    DowntimeFeatureTypeConstants,
    (memo: DowntimeWindowsByFeatureType, value: DowntimeFeatureType): DowntimeWindowsByFeatureType => {
      memo[value] = undefined
      return memo
    },
    {} as DowntimeWindowsByFeatureType,
  )
}

export const initialErrorsState: ErrorsState = {
  tryAgain: () => Promise.resolve(),
  errorsByScreenID: initializeErrorsByScreenID(),
  downtimeWindowsByFeature: initializeDowntimeWindowsByFeature(),
}

/**
 * checks for downtime by getting a list from the backend API
 * clears all metadata and current downtimes first and sets errors based on which downtime is active from API call
 */
export const checkForDowntimeErrors = (): AppThunk => async (dispatch) => {
  const response = await get<MaintenanceWindowsGetData>('/v0/maintenance_windows')
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

const errorSlice = createSlice({
  name: 'error',
  initialState: initialErrorsState,
  reducers: {
    dispatchSetError: (state, action: PayloadAction<{ errorType?: CommonErrorTypes; screenID?: ScreenIDTypes }>) => {
      const { errorType, screenID } = action.payload

      const errorsByScreenID = !screenID
        ? state.errorsByScreenID
        : {
            ...state.errorsByScreenID,
            [screenID as ScreenIDTypes]: errorType,
          }
      state.errorsByScreenID = errorsByScreenID
    },

    dispatchClearErrors: (state, action: PayloadAction<ScreenIDTypes | undefined>) => {
      const screenID = action.payload
      const errorsByScreenID = !screenID
        ? initialErrorsState.errorsByScreenID
        : {
            ...state.errorsByScreenID,
            [screenID as ScreenIDTypes]: undefined,
          }
      return {
        ...state,
        errorsByScreenID,
      }
    },

    dispatchSetTryAgainFunction: (state, action: PayloadAction<() => Promise<void>>) => {
      state.tryAgain = action.payload
    },

    dispatchSetDowntime: (state, action: PayloadAction<DowntimeWindowsByFeatureType>) => {
      state.downtimeWindowsByFeature = action.payload
    },
  },
})

export const { dispatchSetError, dispatchClearErrors, dispatchSetTryAgainFunction, dispatchSetDowntime } = errorSlice.actions
export default errorSlice.reducer
