import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { reduce } from 'underscore'

import { CommonErrorTypes } from 'constants/errors'
import { DowntimeFeatureType, ScreenIDTypes } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

export type ErrorsByScreenIDType = {
  [key in ScreenIDTypes]?: CommonErrorTypes
}

export type DowntimeWindowsByFeatureType = {
  [key in DowntimeFeatureType]?: DowntimeWindow
}

export type DowntimeWindow = {
  startTime: DateTime
  endTime: DateTime
}

export type ErrorsState = {
  errorsByScreenID: ErrorsByScreenIDType
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

export const initialErrorsState: ErrorsState = {
  tryAgain: () => Promise.resolve(),
  errorsByScreenID: initializeErrorsByScreenID(),
}

/**
 * Redux slice that will create the actions and reducers
 */
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

      state.errorsByScreenID = errorsByScreenID
    },

    dispatchSetTryAgainFunction: (state, action: PayloadAction<() => Promise<void>>) => {
      state.tryAgain = action.payload
    },
  },
})

export const { dispatchSetError, dispatchClearErrors, dispatchSetTryAgainFunction } = errorSlice.actions
export default errorSlice.reducer
