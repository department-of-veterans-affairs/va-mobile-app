import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, SecureMessagingSignatureData, SecureMessagingSignatureDataAttributes } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message signature
 */
const getMessageSignature = async (
  queryClient: QueryClient,
): Promise<SecureMessagingSignatureDataAttributes | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === secureMessagingKeys.signature[0]) {
        throw error.error
      }
    })
  }
  const response = await get<SecureMessagingSignatureData>('/v0/messaging/health/messages/signature')
  return response?.data.attributes
}

/**
 * Returns a query for a user message signature
 */
export const useMessageSignature = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.signature,
    queryFn: () => getMessageSignature(queryClient),
    meta: {
      errorName: 'getMessageSignature: Service error',
    },
  })
}
