import { useQuery } from 'api/queryClient'
import { secureMessagingKeys } from 'api/secureMessaging/queryKeys'
import { SecureMessagingThreadGetData } from 'api/types'
import { Params, get } from 'store/api'

/**
 * Fetch user message thread based on original message ID
 */
const getThread = (
  messageID: number,
  excludeProvidedMessage: boolean,
): Promise<SecureMessagingThreadGetData | undefined> => {
  return get<SecureMessagingThreadGetData>(
    `/v1/messaging/health/messages/${messageID}/thread?excludeProvidedMessage=${excludeProvidedMessage}`,
    {
      useCache: 'false',
    } as Params,
  )
}

/**
 * Returns a query for a user message thread based on original message ID
 */
export const useThread = (messageID: number, excludeProvidedMessage: boolean, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    staleTime: 0,
    queryKey: [secureMessagingKeys.thread, messageID, excludeProvidedMessage],
    queryFn: () => getThread(messageID, excludeProvidedMessage),
    meta: {
      errorName: 'getThread: Service error',
    },
  })
}
