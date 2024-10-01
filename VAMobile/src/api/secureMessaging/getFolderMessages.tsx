import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { SecureMessagingFolderMessagesGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user folder messages
 */
const getFolderMessages = (
  folderID: number,
  queryClient: QueryClient,
): Promise<SecureMessagingFolderMessagesGetData | undefined> => {
  return get<SecureMessagingFolderMessagesGetData>(
    `/v0/messaging/health/folders/${folderID}/messages`,
    {
      page: '1',
      per_page: LARGE_PAGE_SIZE.toString(),
      useCache: 'false',
    } as Params,
    secureMessagingKeys.folderMessages,
    queryClient,
  )
}

/**
 * Returns a query for a user folder messages
 */
export const useFolderMessages = (folderID: number, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.folderMessages, folderID],
    queryFn: () => getFolderMessages(folderID, queryClient),
    meta: {
      errorName: 'getFolderMessages: Service error',
    },
  })
}
