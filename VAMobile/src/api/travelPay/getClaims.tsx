import { useQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import { GetTravelPayClaimsParams, GetTravelPayClaimsResponse } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/timeframes'
import { DowntimeFeatureTypeConstants, Params, get } from 'store/api'
import { useDowntime } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch paginated travel pay claims
 */
const getClaims = async (params: GetTravelPayClaimsParams): Promise<GetTravelPayClaimsResponse | undefined> => {
  const url = `/v0/travel-pay/claims`
  const response = await get<GetTravelPayClaimsResponse>(url, params as unknown as Params)
  return response
}

/**
 * Returns a query for paginated travel pay claims
 */
export const useTravelPayClaims = (params: GetTravelPayClaimsParams) => {
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPayStatusList')

  return useQuery({
    queryKey: [travelPayKeys.claims, TimeFrameTypeConstants.PAST_THREE_MONTHS],
    queryFn: () => getClaims(params),
    enabled: travelPayEnabled,
    meta: {
      errorName: 'getTravelPayClaims: Service error',
    },
  })
}
