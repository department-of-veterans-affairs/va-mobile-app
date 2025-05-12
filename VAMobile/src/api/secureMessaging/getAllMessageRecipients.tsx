import { useQuery } from '@tanstack/react-query'
import { filter, groupBy } from 'underscore'

import { SecureMessagingAllRecipientData, SecureMessagingRecipientData, SecureMessagingRecipients } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message recipients
 */
const getAllMessageRecipients = async (): Promise<SecureMessagingAllRecipientData | undefined> => {
  const response = await get<SecureMessagingRecipients>('/v0/messaging/health/allrecipients')
  if (response?.data) {
    const preferredTeam = filter(response?.data, (recipient) => recipient.attributes.preferredTeam)
    // const preferredTeam = response?.data.filter((recipient) => recipient.attributes.preferredTeam)
    // const recipientsByHealthSystem = groupBy(preferredTeam, (recipient) => recipient.attributes.healthCareSystemName)
    return groupBy(preferredTeam, (recipient) => recipient.attributes.healthCareSystemName)
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
