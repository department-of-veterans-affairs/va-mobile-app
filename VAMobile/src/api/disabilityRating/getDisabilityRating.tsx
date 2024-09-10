import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { errorKeys } from 'api/errors'
import { DisabilityRatingData, ErrorData, RatingData } from 'api/types'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { disabilityRatingKeys } from './queryKeys'

/**
 * Fetch user disability rating
 */
const getDisabilityRating = async (queryClient: QueryClient): Promise<RatingData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === disabilityRatingKeys.disabilityRating[0]) {
        throw error.error
      }
    })
  }
  const response = await get<DisabilityRatingData>('/v0/disability-rating')

  return response?.data.attributes
}

/**
 * Returns a query for user disability rating
 */
export const useDisabilityRating = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const disabilityRatingInDowntime = useDowntime(DowntimeFeatureTypeConstants.disabilityRating)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.disabilityRating && !disabilityRatingInDowntime && queryEnabled),
    queryKey: disabilityRatingKeys.disabilityRating,
    queryFn: () => getDisabilityRating(queryClient),
    meta: {
      errorName: 'getDisabilityRating: Service error',
    },
  })
}
