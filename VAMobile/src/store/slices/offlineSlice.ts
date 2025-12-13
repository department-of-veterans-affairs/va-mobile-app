import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

import store, { AppThunk } from 'store'
import { Event, logAnalyticsEvent } from 'utils/analytics'

export type OfflineState = {
  offlineTimestamp?: DateTime
  bannerExpanded: boolean
  isOffline: boolean
  offlineDebugEnabled: boolean
  shouldAnnounceOffline: boolean
  forceOffline: boolean
  /**
   * When we are within a modal, toast notifications do not show. This flag
   * lets us display an alternative alert instead
   */
  viewingModal?: boolean
  lastUpdatedTimestamps: Record<string, string | undefined>
  offlineEventScreenMap: Record<string, Event>
  offlineEvents: Array<Event>
}

export const initialOfflineState: OfflineState = {
  bannerExpanded: false,
  isOffline: false,
  offlineDebugEnabled: false,
  forceOffline: false,
  shouldAnnounceOffline: false,
  lastUpdatedTimestamps: {},
  offlineEventScreenMap: {},
  offlineEvents: [],
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

export const queueOfflineScreenEvent =
  (event: Event): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchQueueOfflineScreenEvent(event))
  }

export const queueOfflineEvent =
  (event: Event): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchQueueOfflineEvent(event))
  }

export const logOfflineEventQueue = (): AppThunk => async (dispatch) => {
  const { offlineEventScreenMap, offlineEvents } = store.getState().offline
  const offlineEventQueue: Array<Event> = [...Object.values(offlineEventScreenMap), ...offlineEvents]
  console.log('logging offline events', offlineEventQueue.length)
  // Go through each queued event, log it and remove it from the queue
  while (offlineEventQueue.length) {
    await logAnalyticsEvent(offlineEventQueue[0])
    offlineEventQueue.shift()
  }

  // Clear the stored offline event queue
  dispatch(dispatchClearOfflineEventQueue())
}

export const setOfflineDebugEnabled =
  (offlineDebugEnabled: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetOfflineDebugEnabled(offlineDebugEnabled))
  }

export const setForceOffline =
  (forceOffline: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetForceOffline(forceOffline))
  }

export const setShouldAnnounceOffline =
  (shouldAnnounceOffline: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetShouldAnnounceOffline(shouldAnnounceOffline))
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
    dispatchQueueOfflineScreenEvent: (state, action: PayloadAction<Event>) => {
      const screen = action.payload.params?.screen_name as string
      if (!state.offlineEventScreenMap[screen]) {
        state.offlineEventScreenMap = {
          ...state.offlineEventScreenMap,
          [screen]: action.payload,
        }
        console.debug(
          'NEW QUEUE LENGTH',
          Object.keys(state.offlineEventScreenMap).length + state.offlineEvents.length,
          action.payload.params?.screen_name,
        )
      }
    },
    dispatchQueueOfflineEvent: (state, action: PayloadAction<Event>) => {
      state.offlineEvents = [...state.offlineEvents, action.payload]
      console.debug('NEW QUEUE LENGTH', Object.keys(state.offlineEventScreenMap).length + state.offlineEvents.length)
    },
    dispatchClearOfflineEventQueue: (state) => {
      state.offlineEventScreenMap = {}
      state.offlineEvents = []
    },
    dispatchSetForceOffline: (state, action: PayloadAction<boolean>) => {
      state.forceOffline = action.payload
    },
    dispatchSetShouldAnnounceOffline: (state, action: PayloadAction<boolean>) => {
      state.shouldAnnounceOffline = action.payload
    },
    dispatchSetOfflineDebugEnabled: (state, action: PayloadAction<boolean>) => {
      state.offlineDebugEnabled = action.payload
      if (!action.payload) {
        state.forceOffline = false
      }
    },
  },
})

const {
  dispatchUpdateOfflineTime,
  dispatchUpdateBannerExpanded,
  dispatchUpdateViewingModal,
  dispatchSetLastUpdatedTime,
  dispatchQueueOfflineScreenEvent,
  dispatchQueueOfflineEvent,
  dispatchClearOfflineEventQueue,
  dispatchSetForceOffline,
  dispatchSetOfflineDebugEnabled,
  dispatchSetShouldAnnounceOffline,
} = offlineSlice.actions
export default offlineSlice.reducer
