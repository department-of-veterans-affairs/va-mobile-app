import { useQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import { GetTravelPayClaimsParams, GetTravelPayClaimsResponse } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/timeframes'
import { Params, get } from 'store/api'

/**
 * Fetch paginated travel pay claims
 */
const getClaims = async (params: GetTravelPayClaimsParams): Promise<GetTravelPayClaimsResponse | undefined> => {
  console.log('get claims!!: ', getClaims)
  const url = `/v0/travel-pay/claims`
  const response = await get<GetTravelPayClaimsResponse>(url, params as unknown as Params) // TODO: SC check
  return response
}

/**
 * Returns a query for paginated travel pay claims
 */
export const useTravelPayClaims = (params: GetTravelPayClaimsParams) => {
  // TODO: sc: check for downtime and other considerations - do they apply here?
  return useQuery({
    queryKey: [travelPayKeys.claims, TimeFrameTypeConstants.PAST_THREE_MONTHS],
    queryFn: () => getClaims(params),
    meta: {
      errorName: 'getClaims: Service error',
    },
  })
}
