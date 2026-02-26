import { useQuery } from '@tanstack/react-query'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals/queryKeys'
import { ClaimData, ClaimGetData } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch user Claim
 */
const getClaim = async (id: string, provider?: string): Promise<ClaimData | undefined> => {
  const url = provider ? `/v0/claim/${id}?type=${provider}` : `/v0/claim/${id}`
  const response = await get<ClaimGetData>(url, {})
  return response?.data
}

/**
 * Returns a query for user Claim
 */
export const useClaim = (id: string, provider?: string, options?: { enabled?: boolean }) => {
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const effectiveProvider = userAuthorizedServices?.cstMultiClaimProvider ? provider : undefined

  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claim, id],
    queryFn: () => getClaim(id, effectiveProvider),
    meta: {
      errorName: 'getClaim: Service error',
    },
  })
}
