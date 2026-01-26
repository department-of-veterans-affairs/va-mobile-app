import { useQuery } from '@tanstack/react-query'

import { VeteranStatusCardResponse } from 'api/types'
import { veteranStatusKeys } from 'api/veteranStatus'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch veteran status card
 */
const getVeteranStatusCard = async (): Promise<VeteranStatusCardResponse | undefined> => {
  const response = await get<VeteranStatusCardResponse>('/v0/veteran_status_card')
  if (response) {
    return response
  }
}

/**
 * Returns a query for a veteran status card
 */
export const useVeteranStatusCard = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: veteranStatusKeys.card,
    queryFn: () => getVeteranStatusCard(),
    meta: {
      errorName: 'getVeteranStatusCard: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
