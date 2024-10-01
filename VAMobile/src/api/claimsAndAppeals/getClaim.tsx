import { useQuery } from '@tanstack/react-query'

import { ClaimData, ClaimGetData } from 'api/types'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user Claim
 */
const getClaim = async (id: string, abortSignal?: AbortSignal): Promise<ClaimData | undefined> => {
  const response = await get<ClaimGetData>(`/v0/claim/${id}`, {}, claimsAndAppealsKeys.claim, abortSignal)
  return response?.data
}

/**
 * Returns a query for user Claim
 */
export const useClaim = (id: string, abortSignal?: AbortSignal, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claim, id],
    queryFn: () => getClaim(id, abortSignal),
    meta: {
      errorName: 'getClaim: Service error',
    },
  })
}
