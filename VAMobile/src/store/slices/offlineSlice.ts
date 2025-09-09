import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

import { AppThunk } from 'store'

export type OfflineState = {
  offlineTimestamp?: DateTime
  bannerExpanded: boolean
  isOffline: boolean
}

export const initialOfflineState: OfflineState = {
  bannerExpanded: false,
  isOffline: false,
}

export const setOfflineTimestamp =
  (value: DateTime | undefined): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateOfflineTime(value))
  }

export const setBannerExpanded =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateBannerExpanded(value))
  }

/**
 * Redux slice that will create the actions and reducers
 */
const offlineSlice = createSlice({
  name: 'offline',
  initialState: initialOfflineState,
  reducers: {
    dispatchUpdateOfflineTime: (state, action: PayloadAction<DateTime | undefined>) => {
      state.offlineTimestamp = action.payload
    },
    dispatchUpdateBannerExpanded: (state, action: PayloadAction<boolean>) => {
      state.bannerExpanded = action.payload
    },
  },
})

const { dispatchUpdateOfflineTime, dispatchUpdateBannerExpanded } = offlineSlice.actions
export default offlineSlice.reducer
