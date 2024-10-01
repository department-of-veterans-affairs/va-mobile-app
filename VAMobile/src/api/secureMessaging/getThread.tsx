import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { SecureMessagingThreadGetData } from 'api/types'
import { Params, get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message thread based on original message ID
 */
const getThread = (
  messageID: number,
  excludeProvidedMessage: boolean,
  queryClient: QueryClient,
): Promise<SecureMessagingThreadGetData | undefined> => {
  return get<SecureMessagingThreadGetData>(
    `/v1/messaging/health/messages/${messageID}/thread?excludeProvidedMessage=${excludeProvidedMessage}`,
    {
      useCache: 'false',
    } as Params,
    secureMessagingKeys.thread,
    queryClient,
  )
}

/**
 * Returns a query for a user message thread based on original message ID
 */
export const useThread = (messageID: number, excludeProvidedMessage: boolean, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    staleTime: 0,
    queryKey: [secureMessagingKeys.thread, messageID, excludeProvidedMessage],
    queryFn: () => getThread(messageID, excludeProvidedMessage, queryClient),
    meta: {
      errorName: 'getThread: Service error',
    },
  })
}
