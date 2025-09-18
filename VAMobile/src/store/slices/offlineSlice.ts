import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

import { AppThunk } from 'store'

export type OfflineState = {
  offlineTimestamp?: DateTime
  bannerExpanded: boolean
  isOffline: boolean
  forceOffline?: boolean
  /**
   * When we are within a modal, toast notifications do not show. This flag
   * lets us display an alternative alert instead
   */
  viewingModal?: boolean
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

export const setViewingModal =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateViewingModal(value))
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
    dispatchUpdateViewingModal: (state, action: PayloadAction<boolean>) => {
      state.viewingModal = action.payload
    },
  },
})

const { dispatchUpdateOfflineTime, dispatchUpdateBannerExpanded, dispatchUpdateViewingModal } = offlineSlice.actions
export default offlineSlice.reducer
