import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from 'store/api'
import { AppThunk } from 'store'
import { RatingData, ScreenIDTypes } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'

export type DisabilityRatingState = {
  ratingData?: RatingData
  error?: Error
  loading: boolean
  needsDataLoad: boolean
  preloadComplete: boolean
}

export const initialDisabilityRatingState: DisabilityRatingState = {
  loading: false,
  needsDataLoad: true,
  preloadComplete: false,
}

export const getDisabilityRating =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getDisabilityRating(screenID))))

    try {
      dispatch(dispatchStartGetRating())
      const ratingData = await api.get<api.DisabilityRatingData>('/v0/disability-rating')

      dispatch(dispatchFinishGetRating({ ratingData: ratingData?.data.attributes }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetRating({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

const disabilitRatingSlice = createSlice({
  name: 'disabilityRating',
  initialState: initialDisabilityRatingState,
  reducers: {
    dispatchStartGetRating: (state) => {
      state.loading = true
    },

    dispatchFinishGetRating: (state, action: PayloadAction<{ ratingData?: RatingData; error?: Error }>) => {
      const { ratingData, error } = action.payload
      state.ratingData = ratingData
      state.error = error
      state.needsDataLoad = error ? true : false
      state.preloadComplete = true
      state.loading = false
    },

    dispatchDisabilityRatingLogout: () => {
      return { ...initialDisabilityRatingState }
    },
  },
})

export const { dispatchDisabilityRatingLogout, dispatchFinishGetRating, dispatchStartGetRating } = disabilitRatingSlice.actions
export default disabilitRatingSlice.reducer
