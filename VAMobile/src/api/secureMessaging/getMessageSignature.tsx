import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { SecureMessagingSignatureData, SecureMessagingSignatureDataAttributes } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message signature
 */
const getMessageSignature = async (
  queryClient: QueryClient,
): Promise<SecureMessagingSignatureDataAttributes | undefined> => {
  const response = await get<SecureMessagingSignatureData>(
    '/v0/messaging/health/messages/signature',
    undefined,
    secureMessagingKeys.signature,
    queryClient,
  )
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
