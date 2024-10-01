import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { DisabilityRatingData, RatingData } from 'api/types'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { disabilityRatingKeys } from './queryKeys'

/**
 * Fetch user disability rating
 */
const getDisabilityRating = async (): Promise<RatingData | undefined> => {
  const response = await get<DisabilityRatingData>(
    '/v0/disability-rating',
    undefined,
    disabilityRatingKeys.disabilityRating,
  )

  return response?.data.attributes
}

/**
 * Returns a query for user disability rating
 */
export const useDisabilityRating = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const disabilityRatingInDowntime = useDowntime(DowntimeFeatureTypeConstants.disabilityRating)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.disabilityRating && !disabilityRatingInDowntime && queryEnabled),
    queryKey: disabilityRatingKeys.disabilityRating,
    queryFn: () => getDisabilityRating(),
    meta: {
      errorName: 'getDisabilityRating: Service error',
    },
  })
}
