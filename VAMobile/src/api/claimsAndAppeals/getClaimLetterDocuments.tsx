import { useQuery } from '@tanstack/react-query'

import { ClaimLetterDocsData, ClaimLetterDocuments } from 'api/types'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user Claim Letter Documents
 */
const getClaimLetterDocuments = async (): Promise<Array<ClaimLetterDocuments> | undefined> => {
  const response = await get<ClaimLetterDocsData>(`/v0/claim-letter/documents`, {})
  return response?.data
}

/**
 * Returns a query for user Claim Letter Documents
 */
export const useClaimLetterDocuments = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claimLetterDocs],
    queryFn: () => getClaimLetterDocuments(),
    meta: {
      errorName: 'get Claim Letter Documents: Service error',
    },
  })
}
