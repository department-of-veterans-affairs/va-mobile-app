import { useQuery } from '@tanstack/react-query'

import { useQueryCacheOptions } from 'api/queryClient'
import { VeteranVerificationStatusPayload } from 'api/types'
import { veteranStatusKeys } from 'api/veteranStatus/queryKeys'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch veteran verification status
 */
const getVeteranStatus = async (): Promise<VeteranVerificationStatusPayload | undefined> => {
  const response = await get<VeteranVerificationStatusPayload>('/v0/vet_verification_status')
  if (response) {
    return response
  }
}

/**
 * Returns a query for a veterans verification status
 */
export const useVeteranStatus = (options?: { enabled?: boolean }) => {
  const queryCacheOptions = useQueryCacheOptions()
  return useQuery({
    ...options,
    ...queryCacheOptions,
    queryKey: veteranStatusKeys.verification,
    queryFn: () => getVeteranStatus(),
    meta: {
      errorName: 'getVeteranStatus: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
