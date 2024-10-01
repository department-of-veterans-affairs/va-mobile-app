import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { ClaimData, ClaimGetData } from 'api/types'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user Claim
 */
const getClaim = async (
  id: string,
  queryClient: QueryClient,
  abortSignal?: AbortSignal,
): Promise<ClaimData | undefined> => {
  const response = await get<ClaimGetData>(`/v0/claim/${id}`, {}, claimsAndAppealsKeys.claim, queryClient, abortSignal)
  return response?.data
}

/**
 * Returns a query for user Claim
 */
export const useClaim = (id: string, abortSignal?: AbortSignal, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claim, id],
    queryFn: () => getClaim(id, queryClient, abortSignal),
    meta: {
      errorName: 'getClaim: Service error',
    },
  })
}
