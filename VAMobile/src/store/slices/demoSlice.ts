import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { errors } from 'api/types'
import { AppThunk } from 'store'
import * as api from 'store/api'

import { initDemoStore } from '../api/demo/store'

export type DemoState = {
  demoMode: boolean
  overrideErrors: Array<errors>
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
 * sets the error overrides for demo mode
 */
export const updateErrorOverrides =
  (errorOverrides: Array<errors>): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateErrors(errorOverrides))
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
    dispatchUpdateErrors: (state, action: PayloadAction<Array<errors>>) => {
      state.overrideErrors = action.payload
    },
  },
})

const { dispatchUpdateDemoMode, dispatchUpdateErrors } = demoSlice.actions
export default demoSlice.reducer
