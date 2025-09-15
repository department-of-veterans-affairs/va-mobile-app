import { useQuery } from 'api/queryClient'
import { secureMessagingKeys } from 'api/secureMessaging/queryKeys'
import { SecureMessagingSignatureData, SecureMessagingSignatureDataAttributes } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch user message signature
 */
const getMessageSignature = async (): Promise<SecureMessagingSignatureDataAttributes | undefined> => {
  const response = await get<SecureMessagingSignatureData>('/v0/messaging/health/messages/signature')
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
