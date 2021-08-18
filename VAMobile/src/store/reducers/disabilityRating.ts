import { LoadingStatusTypeConstants, LoadingStatusTypes } from 'constants/common'
import { RatingData } from 'store/api'
import createReducer from './createReducer'

export type DisabilityRatingState = {
  ratingData?: RatingData
  error?: Error
  loadingDisabilityRatingStatus: LoadingStatusTypes
}

export const initialDisabilityRatingState: DisabilityRatingState = {
  loadingDisabilityRatingStatus: LoadingStatusTypeConstants.INIT,
}

export default createReducer<DisabilityRatingState>(initialDisabilityRatingState, {
  DISABILITY_RATING_START_GET_RATING: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingDisabilityRatingStatus: LoadingStatusTypeConstants.LOADING,
    }
  },
  DISABILITY_RATING_FINISH_GET_RATING: (state, { ratingData, error }) => {
    return {
      ...state,
      error,
      ratingData,
      loadingDisabilityRatingStatus: error ? LoadingStatusTypeConstants.ERROR : LoadingStatusTypeConstants.SUCCESS,
    }
  },
  DISABILITY_RATING_ON_LOGOUT: (_state, _payload) => {
    return {
      ...initialDisabilityRatingState,
    }
  },
})
