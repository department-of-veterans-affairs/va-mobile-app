import { useQuery } from '@tanstack/react-query'

import { VeteranVerificationStatusData } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

import { veteranStatusKeys } from './queryKeys'

/**
 * Fetch user veteran verification status
 */
const getVeteranStatus = async (): Promise<VeteranVerificationStatusData | undefined> => {
  const response = await get<VeteranVerificationStatusData>('/v0/vet_verification_status')
  if (response) {
    return {
      ...response,
    }
  }
}

/**
 * Returns a query for a users veteran verification status
 */
export const useVeteranStatus = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: veteranStatusKeys.verification,
    queryFn: () => getVeteranStatus(),
    meta: {
      errorName: 'getVeteranStatus: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
