import { useQuery } from '@tanstack/react-query'

import { SecureMessagingSignatureData, SecureMessagingSignatureDataAttributes } from 'api/types'
import { get } from 'store/api'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user message signature
 */
const getMessageSignature = async (): Promise<SecureMessagingSignatureDataAttributes | undefined> => {
  const response = await get<SecureMessagingSignatureData>(
    '/v0/messaging/health/messages/signature',
    undefined,
    secureMessagingKeys.signature,
  )
  return response?.data.attributes
}

/**
 * Returns a query for a user message signature
 */
export const useMessageSignature = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: secureMessagingKeys.signature,
    queryFn: () => getMessageSignature(),
    meta: {
      errorName: 'getMessageSignature: Service error',
    },
  })
}
