import { RatingData } from 'store/api'
import createReducer from './createReducer'

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

export default createReducer<DisabilityRatingState>(initialDisabilityRatingState, {
  DISABILITY_RATING_START_GET_RATING: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  DISABILITY_RATING_FINISH_GET_RATING: (state, { ratingData, error }) => {
    return {
      ...state,
      error,
      ratingData,
      needsDataLoad: error ? true : false,
      preloadComplete: true,
      loading: false,
    }
  },
  DISABILITY_RATING_ON_LOGOUT: (_state, _payload) => {
    return {
      ...initialDisabilityRatingState,
    }
  },
})
