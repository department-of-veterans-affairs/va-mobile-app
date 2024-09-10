import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, SecureMessagingThreadGetData } from 'api/types'
import { Params, get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message thread based on original message ID
 */
const getThread = (
  messageID: number,
  excludeProvidedMessage: boolean,
  queryClient: QueryClient,
): Promise<SecureMessagingThreadGetData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === secureMessagingKeys.thread[0]) {
        throw error.error
      }
    })
  }
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
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    staleTime: 0,
    queryKey: [secureMessagingKeys.thread, messageID, excludeProvidedMessage],
    queryFn: () => getThread(messageID, excludeProvidedMessage, queryClient),
    meta: {
      errorName: 'getThread: Service error',
    },
  })
}
