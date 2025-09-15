import { useQuery } from 'api/queryClient'
import { secureMessagingKeys } from 'api/secureMessaging/queryKeys'
import { SecureMessagingRecipients } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch user message recipients
 */
const getAllMessageRecipients = async (): Promise<SecureMessagingRecipients | undefined> => {
  const response = await get<SecureMessagingRecipients>('/v0/messaging/health/allrecipients')
  return response
}

/**
 * Returns a query for a user message recipients
 */
export const useAllMessageRecipients = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.allRecipients,
    queryFn: () => getAllMessageRecipients(),
    meta: {
      errorName: 'getAllMessageRecipients: Service error',
    },
  })
}
