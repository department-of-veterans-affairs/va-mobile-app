import { useQuery } from '@tanstack/react-query'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals/queryKeys'
import { ClaimData, ClaimGetData } from 'api/types'
import { get } from 'store/api'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch user Claim
 */
const getClaim = async (id: string, provider?: string): Promise<ClaimData | undefined> => {
  const useProvider = featureEnabled('cstMultiClaimProvider') && !!provider
  const url = useProvider ? `/v0/claim/${id}?type=${provider}` : `/v0/claim/${id}`
  const response = await get<ClaimGetData>(url, {})
  return response?.data
}

/**
 * Returns a query for user Claim
 */
export const useClaim = (id: string, provider?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claim, id],
    queryFn: () => getClaim(id, provider),
    meta: {
      errorName: 'getClaim: Service error',
    },
  })
}
