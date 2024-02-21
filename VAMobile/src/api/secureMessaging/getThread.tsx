import { useQuery } from '@tanstack/react-query'

import { SecureMessagingThreadGetData } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message thread based on original message ID
 */
const getThread = async (messageID: number): Promise<SecureMessagingThreadGetData | undefined> => {
  return get<SecureMessagingThreadGetData>(
    `/v1/messaging/health/messages/${messageID}/thread?excludeProvidedMessage=true`,
  )
}

/**
 * Returns a query for a user message thread based on original message ID
 */
export const useThread = (messageID: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.thread, messageID],
    queryFn: () => getThread(messageID),
    meta: {
      errorName: 'getThread: Service error',
    },
  })
}
