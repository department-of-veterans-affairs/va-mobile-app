import { useQuery } from '@tanstack/react-query'

import { SecureMessagingFoldersGetData } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user folders
 */
const getFolders = async (): Promise<SecureMessagingFoldersGetData | undefined> => {
  return get<SecureMessagingFoldersGetData>('/v0/messaging/health/folders')
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
