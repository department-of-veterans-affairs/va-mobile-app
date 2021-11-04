import * as api from 'store/api'
import { AppThunk } from 'store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { initDemoStore } from '../api/demo/store'

export type DemoState = {
  demoMode: boolean
}

export const initialDemoState: DemoState = {
  demoMode: false,
}

export const updateDemoMode =
  (demoMode: boolean): AppThunk =>
  async (dispatch) => {
    api.setDemoMode(demoMode)
    dispatch(dispatchUpdateDemoMode(demoMode))
    await initDemoStore()
  }

const demoSlice = createSlice({
  name: 'demo',
  initialState: initialDemoState,
  reducers: {
    dispatchUpdateDemoMode: (state, action: PayloadAction<boolean>) => {
      state.demoMode = action.payload
    },
  },
})

const { dispatchUpdateDemoMode } = demoSlice.actions
export default demoSlice.reducer
