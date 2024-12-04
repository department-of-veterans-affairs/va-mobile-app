import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { SecureMessagingFoldersGetData } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user folders
 */
const getFolders = async (): Promise<SecureMessagingFoldersGetData | undefined> => {
  const response = await get<SecureMessagingFoldersGetData>('/v0/messaging/health/folders')
  if (response) {
    return {
      ...response,
      inboxUnreadCount:
        response?.data.find((folder) => folder.attributes.name === FolderNameTypeConstants.inbox)?.attributes
          .unreadCount || 0,
    }
  }
}

/**
 * Returns a query for a user folders
 */
export const useFolders = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const secureMessagingInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.secureMessaging && !secureMessagingInDowntime && queryEnabled),
    queryKey: secureMessagingKeys.folders,
    queryFn: () => getFolders(),
    meta: {
      errorName: 'getFolders: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
