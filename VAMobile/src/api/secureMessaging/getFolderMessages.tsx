import { useQuery } from '@tanstack/react-query'

import { SecureMessagingFolderMessagesGetData } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user folder messages
 */
const getFolderMessages = (
  folderID: number,
  page: number,
): Promise<SecureMessagingFolderMessagesGetData | undefined> => {
  return get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
    page: page.toString(),
    per_page: DEFAULT_PAGE_SIZE.toString(),
  } as Params)
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
