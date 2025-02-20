import { useQuery } from '@tanstack/react-query'

import { ClaimEFolderData, ClaimEFolderDocuments } from 'api/types'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user E Folder Documents
 */
const getEfolderDocuments = async (): Promise<Array<ClaimEFolderDocuments> | undefined> => {
  const response = await get<ClaimEFolderData>(`/v0/efolder/documents`, {})
  return response?.data
}

/**
 * Returns a query for user E Folder Documents
 */
export const useEFolderDocuments = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.eFolderDocs],
    queryFn: () => getEfolderDocuments(),
    meta: {
      errorName: 'get E Folder Documents: Service error',
    },
  })
}
