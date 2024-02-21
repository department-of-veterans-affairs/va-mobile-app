import { useQuery } from '@tanstack/react-query'

import { SecureMessagingFolderGetData, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { Events } from 'constants/analytics'
import { get } from 'store/api'
import { logAnalyticsEvent } from 'utils/analytics'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user inbox data for unread count
 */
const getInboxData = async (inboxFirstRetrieval?: boolean): Promise<SecureMessagingFolderGetData | undefined> => {
  const response = await get<SecureMessagingFolderGetData>(
    `/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}`,
  )
  if (inboxFirstRetrieval && response?.data?.attributes?.unreadCount) {
    logAnalyticsEvent(Events.vama_hs_sm_count(response?.data.attributes.unreadCount))
  }
  return response
}

/**
 * Returns a query for a user inbox data for unread count
 */
export const useInboxData = (inboxFirstRetrieval?: boolean, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.inboxData,
    queryFn: () => getInboxData(inboxFirstRetrieval),
    meta: {
      errorName: 'getInboxData: Service error',
    },
  })
}
