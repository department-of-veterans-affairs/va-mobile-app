import { useQuery } from '@tanstack/react-query'

import { SecureMessagingRecipientData, SecureMessagingRecipients } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message recipients
 */
const getMessageRecipients = async (): Promise<Array<SecureMessagingRecipientData> | undefined> => {
  const response = await get<SecureMessagingRecipients>('/v0/messaging/health/recipients')
  return response?.data.filter((recipient) => recipient.attributes.preferredTeam)
}

/**
 * Returns a query for a user message recipients
 */
export const useMessageRecipients = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.recipients,
    queryFn: () => getMessageRecipients(),
    meta: {
      errorName: 'getMessageRecipients: Service error',
    },
  })
}
