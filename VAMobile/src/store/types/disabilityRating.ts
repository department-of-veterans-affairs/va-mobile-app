import { ActionDef, EmptyPayload } from './index'
import { RatingData } from 'store/api'

/**
 * Redux payload for DISABILITY_RATING_START_GET_RATING action
 */
export type DisabilityRatingStartGetRatingPayload = Record<string, unknown>

/**
 *  Redux payload for DISABILITY_RATING_FINISH_GET_RATING action
 */
export type DisabilityRatingPayload = {
  ratingData?: RatingData
  error?: Error
}

/**
 *  All disability rating actions
 */
export interface DisabilityRatingActions {
  /** Redux action to signify the initial start of getting the disablity rating*/
  DISABILITY_RATING_START_GET_RATING: ActionDef<'DISABILITY_RATING_START_GET_RATING', DisabilityRatingPayload>
  /** Redux action to signify that the disability rating is being retrieved */
  DISABILITY_RATING_FINISH_GET_RATING: ActionDef<'DISABILITY_RATING_FINISH_GET_RATING', DisabilityRatingPayload>
  /** Redux action to clear disability rating data on logout **/
  DISABILITY_RATING_ON_LOGOUT: ActionDef<'DISABILITY_RATING_ON_LOGOUT', EmptyPayload>
}
