import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { AppThunk } from 'store'
import { SortOption, SortOptionType } from 'utils/travelPay'

export type TravelClaimsUIState = {
  timeFrame: TimeFrameType
  claimsFilter: Set<string>
  claimsSortBy: SortOptionType
  currentPage: number
}

export const initialTravelClaimsUIState: TravelClaimsUIState = {
  timeFrame: TimeFrameTypeConstants.PAST_THREE_MONTHS,
  claimsFilter: new Set(),
  claimsSortBy: SortOption.Recent,
  currentPage: 1,
}

export const updateTravelClaimsTimeFrame =
  (value: TimeFrameType): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetTravelClaimsTimeFrame(value))
  }

export const updateTravelClaimsFilter =
  (value: Set<string>): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetTravelClaimsFilter(value))
  }

export const updateTravelClaimsSortBy =
  (value: SortOptionType): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetTravelClaimsSortBy(value))
  }

export const updateTravelClaimsPage =
  (value: number): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchSetTravelClaimsPage(value))
  }

const travelClaimsSlice = createSlice({
  name: 'travelClaimsUI',
  initialState: initialTravelClaimsUIState,
  reducers: {
    dispatchSetTravelClaimsTimeFrame: (state, action: PayloadAction<TimeFrameType>) => {
      state.timeFrame = action.payload
    },
    dispatchSetTravelClaimsFilter: (state, action: PayloadAction<Set<string>>) => {
      state.claimsFilter = action.payload
    },
    dispatchSetTravelClaimsSortBy: (state, action: PayloadAction<SortOptionType>) => {
      state.claimsSortBy = action.payload
    },
    dispatchSetTravelClaimsPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
})

export const {
  dispatchSetTravelClaimsTimeFrame,
  dispatchSetTravelClaimsFilter,
  dispatchSetTravelClaimsSortBy,
  dispatchSetTravelClaimsPage,
} = travelClaimsSlice.actions

export default travelClaimsSlice.reducer
