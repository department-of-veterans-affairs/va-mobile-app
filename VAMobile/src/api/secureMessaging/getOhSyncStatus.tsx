import { useQuery } from '@tanstack/react-query'

import { secureMessagingKeys } from 'api/secureMessaging'
import { OhSyncStatusData } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch OH sync status to determine if historic messages are still being loaded
 * after a facility migration to Oracle Health.
 */
const getOhSyncStatus = (): Promise<OhSyncStatusData | undefined> => {
  // TODO: Update URL once backend team confirms the vets-api proxy endpoint
  return get<OhSyncStatusData>('/v0/messaging/health/exchange/sync_status')
}

/**
 * Returns a query for the OH sync status.
 * When syncComplete is false, a loading alert should be shown in the inbox.
 */
export const useOhSyncStatus = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.ohSyncStatus,
    queryFn: () => getOhSyncStatus(),
    meta: {
      errorName: 'getOhSyncStatus: Service error',
    },
  })
}
