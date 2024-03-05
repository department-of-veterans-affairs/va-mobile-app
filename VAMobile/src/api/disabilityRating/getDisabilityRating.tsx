import { useQuery } from '@tanstack/react-query'

import { DisabilityRatingData, RatingData } from 'api/types'
import { get } from 'store/api'

import { disabilityRatingKeys } from './queryKeys'

/**
 * Fetch user disability rating
 */
const getDisabilityRating = async (): Promise<RatingData | undefined> => {
  const response = await get<DisabilityRatingData>('/v0/disability-rating')

  return response?.data.attributes
}

/**
 * Returns a query for user disability rating
 */
export const useDisabilityRating = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: disabilityRatingKeys.disabilityRating,
    queryFn: () => getDisabilityRating(),
    meta: {
      errorName: 'getDisabilityRating: Service error',
    },
  })
}
