import { useQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import { GetTravelPayClaimsParams, GetTravelPayClaimsResponse } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch paginated travel pay claims
 */
const getClaims = async (_params: GetTravelPayClaimsParams): Promise<GetTravelPayClaimsResponse | undefined> => {
  // const { startDate, endDate, page } = params
  console.log('get claims!!: ', getClaims)
  // const url = `/v0/travel-pay/claims?start_date=${startDate}&end_date=${endDate}&page_number=${page}`
  const url = `/v0/travel-pay/claims`
  const response = await get<GetTravelPayClaimsResponse>(url)
  return response
}

/**
 * Returns a query for paginated travel pay claims
 */
export const useTravelPayClaims = (params: GetTravelPayClaimsParams) => {
  // TODO: sc: check for downtime and other considerations - do they apply here?
  return useQuery({
    queryKey: [travelPayKeys.claims], // TODO: fix up
    queryFn: () => getClaims(params),
    meta: {
      errorName: 'getClaims: Service error',
    },
  })
}
