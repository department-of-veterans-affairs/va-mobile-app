import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, SecureMessagingMessageGetData } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message based on message ID
 */
const getMessage = (
  messageID: number,
  queryClient: QueryClient,
): Promise<SecureMessagingMessageGetData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === secureMessagingKeys.message[0]) {
        throw error.error
      }
    })
  }
  return get<SecureMessagingMessageGetData>(`/v0/messaging/health/messages/${messageID}`)
}

/**
 * Returns a query for a user message based message ID
 */
export const useMessage = (messageID: number, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.message, messageID],
    queryFn: () => getMessage(messageID, queryClient),
    meta: {
      errorName: 'getMessage: Service error',
    },
  })
}
