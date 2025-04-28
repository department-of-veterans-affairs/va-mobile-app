import { useQuery } from '@tanstack/react-query'

import { VeteranVerificationStatusPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

import { veteranStatusKeys } from './queryKeys'

/**
 * Fetch veteran verification status
 */
const getVeteranStatus = async (): Promise<VeteranVerificationStatusPayload | undefined> => {
  const response = await get<VeteranVerificationStatusPayload>('/v0/vet_verification_status')
  if (!response || !response.data) {
    throw new Error('vet_verification_status returned no data')
  }
  return response
}

/**
 * Returns a query for a veterans verification status
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
