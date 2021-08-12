import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { RatingData, ScreenIDTypes } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

const dispatchStartGetRating = (): ReduxAction => {
  return {
    type: 'DISABILITY_RATING_START_GET_RATING',
    payload: {},
  }
}

const dispatchFinishGetRating = (ratingData?: RatingData, error?: Error): ReduxAction => {
  return {
    type: 'DISABILITY_RATING_FINISH_GET_RATING',
    payload: {
      ratingData,
      error,
    },
  }
}

export const dispatchDisabilityRatingLogout = (): ReduxAction => {
  return {
    type: 'DISABILITY_RATING_ON_LOGOUT',
    payload: {},
  }
}

export const getDisabilityRating = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getDisabilityRating(screenID))))

    try {
      dispatch(dispatchStartGetRating())
      const ratingData = await api.get<api.DisabilityRatingData>('/v0/disability-rating')

      dispatch(dispatchFinishGetRating(ratingData?.data.attributes))
    } catch (err) {
      dispatch(dispatchFinishGetRating(undefined, err))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
    }
  }
}
