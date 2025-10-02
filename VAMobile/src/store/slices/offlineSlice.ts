import NetInfo from '@react-native-community/netinfo'

import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { onlineManager } from '@tanstack/react-query'
import { DateTime } from 'luxon'

import { AppThunk } from 'store'

// Using rnc net info create event listener for network connection status
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

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
  lastUpdatedTimestamps: Record<string, string | undefined>
}

export const initialOfflineState: OfflineState = {
  bannerExpanded: false,
  isOffline: false,
  lastUpdatedTimestamps: {},
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

export const setLastUpdatedTimestamp =
  (queryKey: string, timestamp: string | undefined): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetLastUpdatedTime({ queryKey, timestamp }))
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
    dispatchSetLastUpdatedTime: (state, action: PayloadAction<{ queryKey: string; timestamp: string | undefined }>) => {
      const { queryKey, timestamp } = action.payload
      state.lastUpdatedTimestamps[queryKey] = timestamp
    },
  },
})

const {
  dispatchUpdateOfflineTime,
  dispatchUpdateBannerExpanded,
  dispatchUpdateViewingModal,
  dispatchSetLastUpdatedTime,
} = offlineSlice.actions
export default offlineSlice.reducer
