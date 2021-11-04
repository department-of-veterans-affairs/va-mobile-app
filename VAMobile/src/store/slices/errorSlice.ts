import { DateTime } from 'luxon'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { reduce } from 'underscore'

import { AppThunk } from 'store'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { DowntimeFeatureNameConstants, DowntimeFeatureToScreenID, MaintenanceWindowsGetData, ScreenIDTypes, get } from '../api'
import { ScreenIDTypesConstants } from '../api/types/Screens'

export type ErrorsByScreenIDType = {
  [key in ScreenIDTypes]?: CommonErrorTypes
}

export type ErrorMetadataByScreenIDType = {
  [key in ScreenIDTypes]?: {
    [key: string]: string
  }
}

export type ErrorsState = {
  errorsByScreenID: ErrorsByScreenIDType
  errorMetadataByScreenID: ErrorMetadataByScreenIDType
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

export const initializeErrorMetadataByScreenID = (): ErrorMetadataByScreenIDType => {
  return reduce(
    ScreenIDTypesConstants,
    (memo: ErrorMetadataByScreenIDType, value: ScreenIDTypes): ErrorMetadataByScreenIDType => {
      memo[value] = undefined
      return memo
    },
    {} as ErrorMetadataByScreenIDType,
  )
}

export const initialErrorsState: ErrorsState = {
  tryAgain: () => Promise.resolve(),
  errorsByScreenID: initializeErrorsByScreenID(),
  errorMetadataByScreenID: initializeErrorMetadataByScreenID(),
}

export const dispatchCheckForDowntimeErrors = (): AppThunk => async (dispatch) => {
  const response = await get<MaintenanceWindowsGetData>('/v0/maintenance_windows')
  if (!response) {
    return
  }
  dispatch(dispatchClearAllMetadata())
  dispatch(dispatchClearErrorType(CommonErrorTypesConstants.DOWNTIME_ERROR))
  // filtering out any maintenance windows that haven't started yet and ones we haven't mapped to a screen in the app
  const maintWindows = response.data.filter((w) => DateTime.fromISO(w.attributes.startTime) <= DateTime.now() && !!DowntimeFeatureToScreenID[w.attributes.service])
  for (const m of maintWindows) {
    const maintWindow = m.attributes
    const screenID = DowntimeFeatureToScreenID[maintWindow.service]
    if (!screenID) {
      continue
    }
    const metadata = {
      featureName: '',
      endTime: '',
    }
    metadata.featureName = DowntimeFeatureNameConstants[maintWindow.service]
    metadata.endTime = DateTime.fromISO(maintWindow.endTime).toFormat('fff')
    dispatch(dispatchSetMetadata({ metadata, screenID }))
    dispatch(dispatchSetError({ errorType: CommonErrorTypesConstants.DOWNTIME_ERROR, screenID }))
  }
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
      const errorMetadataByScreenID = state.errorMetadataByScreenID
      const errorsByScreenID = !screenID
        ? state.errorsByScreenID
        : {
            ...state.errorsByScreenID,
            [screenID as ScreenIDTypes]: state.errorsByScreenID[screenID] === CommonErrorTypesConstants.DOWNTIME_ERROR ? CommonErrorTypesConstants.DOWNTIME_ERROR : undefined,
          }
      return {
        ...initialErrorsState,
        errorMetadataByScreenID,
        errorsByScreenID,
      }
    },

    dispatchSetTryAgainFunction: (state, action: PayloadAction<() => Promise<void>>) => {
      state.tryAgain = action.payload
    },

    dispatchSetMetadata: (state, action: PayloadAction<{ metadata?: { [key: string]: string }; screenID?: ScreenIDTypes }>) => {
      const { metadata, screenID } = action.payload
      const errorMetadataByScreenID = !screenID
        ? state.errorMetadataByScreenID
        : {
            ...state.errorMetadataByScreenID,
            [screenID as ScreenIDTypes]: metadata,
          }
      return {
        ...state,
        errorMetadataByScreenID,
      }
    },

    dispatchClearMetadata: (state, action: PayloadAction<ScreenIDTypes>) => {
      const screenID = action.payload
      const errorMetadataByScreenID = !screenID
        ? state.errorMetadataByScreenID
        : {
            ...state.errorMetadataByScreenID,
            [screenID as ScreenIDTypes]: undefined,
          }
      return {
        ...state,
        errorMetadataByScreenID,
      }
    },

    dispatchClearAllMetadata: (state) => {
      let errorMetadataByScreenID = state.errorMetadataByScreenID
      for (const screenID in ScreenIDTypesConstants) {
        errorMetadataByScreenID = {
          ...state.errorMetadataByScreenID,
          [screenID as ScreenIDTypes]: undefined,
        }
      }
      return {
        ...state,
        errorMetadataByScreenID,
      }
    },

    dispatchClearErrorType: (state, action: PayloadAction<CommonErrorTypes>) => {
      let errorsByScreenID = state.errorsByScreenID
      errorsByScreenID = reduce(
        ScreenIDTypesConstants,
        (memo: ErrorsByScreenIDType, value: ScreenIDTypes): ErrorsByScreenIDType => {
          memo[value] = errorsByScreenID[value] === action.payload ? undefined : errorsByScreenID[value]
          return memo
        },
        {} as ErrorsByScreenIDType,
      )
      return {
        ...state,
        errorsByScreenID,
      }
    },
  },
})

export const { dispatchSetError, dispatchClearErrors, dispatchSetTryAgainFunction, dispatchSetMetadata, dispatchClearAllMetadata, dispatchClearErrorType, dispatchClearMetadata } =
  errorSlice.actions
export default errorSlice.reducer
