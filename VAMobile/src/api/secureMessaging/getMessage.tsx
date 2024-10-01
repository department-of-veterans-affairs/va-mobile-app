import { useQuery } from '@tanstack/react-query'

import { SecureMessagingMessageGetData } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message based on message ID
 */
const getMessage = (messageID: number): Promise<SecureMessagingMessageGetData | undefined> => {
  return get<SecureMessagingMessageGetData>(
    `/v0/messaging/health/messages/${messageID}`,
    undefined,
    secureMessagingKeys.message,
  )
}

/**
 * Returns a query for a user message based message ID
 */
export const useMessage = (messageID: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.message, messageID],
    queryFn: () => getMessage(messageID),
    meta: {
      errorName: 'getMessage: Service error',
    },
  })
}
