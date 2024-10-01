import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { SecureMessagingRecipientData, SecureMessagingRecipients } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message recipients
 */
const getMessageRecipients = async (
  queryClient: QueryClient,
): Promise<Array<SecureMessagingRecipientData> | undefined> => {
  const response = await get<SecureMessagingRecipients>(
    '/v0/messaging/health/recipients',
    undefined,
    secureMessagingKeys.recipients,
    queryClient,
  )
  return response?.data.filter((recipient) => recipient.attributes.preferredTeam)
}

/**
 * Returns a query for a user message recipients
 */
export const useMessageRecipients = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.recipients,
    queryFn: () => getMessageRecipients(queryClient),
    meta: {
      errorName: 'getMessageRecipients: Service error',
    },
  })
}
