import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

import store, { AppThunk } from 'store'
import { Event, logAnalyticsEvent } from 'utils/analytics'

export type OfflineState = {
  offlineTimestamp?: DateTime
  bannerExpanded: boolean
  isOffline: boolean
  /**
   * When we are within a modal, toast notifications do not show. This flag
   * lets us display an alternative alert instead
   */
  viewingModal?: boolean
  lastUpdatedTimestamps: Record<string, string | undefined>
  offlineEventsMap: Record<string, Event>
}

export const initialOfflineState: OfflineState = {
  bannerExpanded: false,
  isOffline: false,
  lastUpdatedTimestamps: {},
  offlineEventsMap: {},
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

export const queueOfflineEvent =
  (event: Event): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchQueueOfflineEvent(event))
  }

export const logOfflineEventQueue = (): AppThunk => async (dispatch) => {
  const offlineEventQueue: Array<Event> = Object.values(store.getState().offline.offlineEventsMap)

  // Go through each queued event, log it and remove it from the queue
  while (offlineEventQueue.length) {
    await logAnalyticsEvent(offlineEventQueue[0])
    offlineEventQueue.shift()
  }

  // Clear the stored offline event queue
  dispatch(dispatchClearOfflineEventQueue())
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
    dispatchQueueOfflineEvent: (state, action: PayloadAction<Event>) => {
      const screen = action.payload.params?.screen_name as string
      if (!state.offlineEventsMap[screen]) {
        state.offlineEventsMap = {
          ...state.offlineEventsMap,
          [screen]: action.payload,
        }
        console.debug(
          'NEW QUEUE LENGTH',
          Object.keys(state.offlineEventsMap).length,
          action.payload.params?.screen_name,
        )
      }
    },
    dispatchClearOfflineEventQueue: (state) => {
      state.offlineEventsMap = {}
    },
  },
})

const {
  dispatchUpdateOfflineTime,
  dispatchUpdateBannerExpanded,
  dispatchUpdateViewingModal,
  dispatchSetLastUpdatedTime,
  dispatchQueueOfflineEvent,
  dispatchClearOfflineEventQueue,
} = offlineSlice.actions
export default offlineSlice.reducer
