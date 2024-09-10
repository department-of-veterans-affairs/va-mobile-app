import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ClaimData, ClaimGetData, ErrorData } from 'api/types'
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
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === claimsAndAppealsKeys.claim[0]) {
        throw error.error
      }
    })
  }
  const response = await get<ClaimGetData>(`/v0/claim/${id}`, {}, abortSignal)
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
