import { AppThunk } from 'store'
import { DateTime } from 'luxon'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const ACTION_START_DEFAULT = -1

/** type denoting Analytics state values */
export type AnalyticsState = {
  loginTimestamp: number
  totalTimeStart: number
  actionStart: number
}

/** initial values for analyticsState */
export const initialAnalyticsState: AnalyticsState = {
  loginTimestamp: -1,
  totalTimeStart: -1,
  actionStart: -1,
}

/**
 * Redux function to set the loginTimestamp to the current time in milliseconds
 */
export const setAnalyticsLogin = (): AppThunk => async (dispatch) => {
  await dispatch(dispatchSetAnalyticsLogin())
}

/**
 * Redux function to set the totalTimeStart to the current time in milliseconds
 */
export const setAnalyticsTotalTimeStart = (): AppThunk => async (dispatch) => {
  await dispatch(dispatchSetTotalTimeStart())
}

/**
 * Redux function to set the actionStart value to the current timestamp
 */
export const analyticsActionStart = (): AppThunk => async (dispatch) => {
  await dispatch(dispatchSetActionStart(DateTime.now().toMillis()))
}

/** Redux function to reset the action time when action cancels or completes */
export const resetAnalyticsActionStart = (): AppThunk => async (dispatch) => {
  await dispatch(dispatchSetActionStart(ACTION_START_DEFAULT))
}

/**
 * Redux slice that will create the actions and reducers
 */
const analyticSlice = createSlice({
  name: 'analytics',
  initialState: initialAnalyticsState,
  reducers: {
    dispatchSetAnalyticsLogin: (state) => {
      const now = DateTime.now().toMillis()
      state.loginTimestamp = now
      state.totalTimeStart = now
    },

    dispatchSetTotalTimeStart: (state) => {
      state.totalTimeStart = DateTime.now().toMillis()
    },

    dispatchSetActionStart: (state, action: PayloadAction<number>) => {
      state.actionStart = action.payload
    },
  },
})

// Action creators created by the slice
export const { dispatchSetAnalyticsLogin, dispatchSetActionStart, dispatchSetTotalTimeStart } = analyticSlice.actions
export default analyticSlice.reducer
