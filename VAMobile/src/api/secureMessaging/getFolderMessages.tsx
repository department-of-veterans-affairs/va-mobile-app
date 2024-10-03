import { useQuery } from '@tanstack/react-query'

import { SecureMessagingFolderMessagesGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user folder messages
 */
const getFolderMessages = (folderID: number): Promise<SecureMessagingFolderMessagesGetData | undefined> => {
  return get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
    page: '1',
    per_page: LARGE_PAGE_SIZE.toString(),
    useCache: 'false',
  } as Params)
}

/**
 * Returns a query for a user folder messages
 */
export const useFolderMessages = (folderID: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.folderMessages, folderID],
    queryFn: () => getFolderMessages(folderID),
    meta: {
      errorName: 'getFolderMessages: Service error',
    },
  })
}
