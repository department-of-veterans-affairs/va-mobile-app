import { useQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import { GetTravelPayClaimDetailsResponse } from 'api/types'
import { DowntimeFeatureTypeConstants, get } from 'store/api'
import { useDowntime } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

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
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPaySMOC')
  const travelPayClaimDetailsEnabled = featureEnabled('travelPayClaimDetails')

  const queryEnabled = options && typeof options.enabled !== 'undefined' ? options.enabled : true

  console.log('SC: travelPayEnabled: ', travelPayEnabled)
  console.log('SC: travelPaySMOC enabled: ', featureEnabled('travelPaySMOC'))
  console.log('SC: travelPayClaimDetailsEnabled: ', travelPayClaimDetailsEnabled)
  console.log('SC: queryEnabled: ', queryEnabled)

  return useQuery({
    ...options,
    enabled: travelPayEnabled && travelPayClaimDetailsEnabled && queryEnabled && !!id,
    queryKey: travelPayKeys.claimDetails(id),
    queryFn: () => getClaimDetails(id),
    meta: {
      errorName: 'getTravelPayClaimDetails: Service error',
    },
  })
}
