import { useQuery } from '@tanstack/react-query'

import { SecureMessagingFoldersGetData } from 'api/types'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { get } from 'store/api'

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
  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.folders,
    queryFn: () => getFolders(),
    meta: {
      errorName: 'getFolders: Service error',
    },
  })
}
