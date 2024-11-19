import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from 'store'
import * as api from 'store/api'

import { initDemoStore } from '../api/demo/store'

export type DemoState = {
  demoMode: boolean
  overrideErrors: Array<api.APIError>
}

export const initialDemoState: DemoState = {
  demoMode: false,
  overrideErrors: [],
}

/**
 * sets the demo mode on or off
 * @param demoMode- boolean to set as state.demo.demoMode
 * @param loginOut- boolean to set if user is login out
 */
export const updateDemoMode =
  (demoMode: boolean, loginOut = false): AppThunk =>
  async (dispatch) => {
    api.setDemoMode(demoMode)
    dispatch(dispatchUpdateDemoMode(demoMode))
    if (!loginOut) {
      await initDemoStore()
    }
    if (!demoMode) {
      dispatch(dispatchUpdateErrors([]))
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
  },
})

export const { dispatchUpdateDemoMode, dispatchUpdateErrors } = demoSlice.actions
export default demoSlice.reducer
