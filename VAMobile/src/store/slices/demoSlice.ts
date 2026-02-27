import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from 'store'
import * as api from 'store/api'
import { initDemoStore } from 'store/api/demo/store'

type OverrideResponse = {
  endpoint: string
  body: string // JSON string pasted in UI
}

export type DemoState = {
  demoMode: boolean
  overrideErrors: Array<api.APIError>
  overrideResponses: Array<OverrideResponse>
}

export const initialDemoState: DemoState = {
  demoMode: false,
  overrideErrors: [],
  overrideResponses: [],
}

/**
 * sets the demo mode on or off
 * @param demoMode - boolean to set as state.demo.demoMode
 * @param demoUser - string demo user to use
 * @param loginOut - boolean to set if user is login out
 */
export const updateDemoMode =
  (demoMode: boolean, demoUser: string | null, loginOut = false): AppThunk =>
  async (dispatch) => {
    api.setDemoMode(demoMode)
    dispatch(dispatchUpdateDemoMode(demoMode))
    if (!loginOut) {
      await initDemoStore(demoUser)
    }
    if (!demoMode) {
      dispatch(dispatchUpdateErrors([]))
      dispatch(dispatchUpdateResponses([]))
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const demoSlice = createSlice({
  name: 'demo',
  initialState: initialDemoState,
  reducers: {
    dispatchUpdateDemoMode: (state, action: PayloadAction<boolean>) => {
      state.demoMode = action.payload
    },
    dispatchUpdateErrors: (state, action: PayloadAction<Array<api.APIError>>) => {
      state.overrideErrors = action.payload
    },
    dispatchUpdateResponses: (state, action: PayloadAction<Array<OverrideResponse>>) => {
      state.overrideResponses = action.payload
    },
  },
})

export const { dispatchUpdateDemoMode, dispatchUpdateErrors, dispatchUpdateResponses } = demoSlice.actions
export default demoSlice.reducer
