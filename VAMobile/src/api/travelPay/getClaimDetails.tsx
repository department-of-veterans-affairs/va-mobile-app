import { useQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import { GetTravelPayClaimDetailsResponse } from 'api/types'
import { DowntimeFeatureTypeConstants, get } from 'store/api'
import { useDowntime } from 'utils/hooks'

/**
 * Fetch travel pay claim details by ID
 */
const getClaimDetails = async (id: string): Promise<GetTravelPayClaimDetailsResponse | undefined> => {
  return await get<GetTravelPayClaimDetailsResponse>(`/v0/travel-pay/claims/${id}`)
}

/**
 * Returns a query for travel pay claim details by ID
 */
export const useTravelPayClaimDetails = (id: string, options?: { enabled?: boolean }) => {
  const travelPayEnabled = !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures)

  const queryEnabled = options && typeof options.enabled !== 'undefined' ? options.enabled : true

  return useQuery({
    ...options,
    enabled: travelPayEnabled && queryEnabled && !!id,
    queryKey: travelPayKeys.claimDetails(id),
    queryFn: () => getClaimDetails(id),
    meta: {
      errorName: 'getTravelPayClaimDetails: Service error',
    },
  })
}
