import { useQuery } from '@tanstack/react-query'
import { filter } from 'underscore'

import { SecureMessagingRecipientDataList, SecureMessagingRecipients } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message recipients
 */
const getAllMessageRecipients = async (): Promise<SecureMessagingRecipientDataList | undefined> => {
  const response = await get<SecureMessagingRecipients>('/v0/messaging/health/allrecipients')
  if (response?.data) {
    return filter(response?.data, (recipient) => recipient.attributes.preferredTeam)
  }
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
