import { useQuery } from '@tanstack/react-query'

import { SecureMessagingFolderMessagesGetData } from 'api/types'
import { Params, get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user folder messages
 */
const getFolderMessages = async (
  folderID: number,
  page: number,
): Promise<SecureMessagingFolderMessagesGetData | undefined> => {
  const response = await get<SecureMessagingFolderMessagesGetData>(
    `/v0/messaging/health/folders/${folderID}/messages`,
    {
      page: page.toString(),
    } as Params,
  )
  return response
}

/**
 * Returns a query for a user folder messages
 */
export const useFolderMessages = (folderID: number, page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.folderMessages, folderID, page],
    queryFn: () => getFolderMessages(folderID, page),
    meta: {
      errorName: 'getFolderMessages: Service error',
    },
  })
}
