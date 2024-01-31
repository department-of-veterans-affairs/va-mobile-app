import { useQuery } from '@tanstack/react-query'

import { ClaimData, ClaimGetData, get } from 'store/api'
import { ClaimType, ClaimTypeConstants } from 'screens/BenefitsScreen/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsListPayload } from 'api/types/ClaimsAndAppealsData'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user ClaimsAndAppeals
 */
export const getClaimsAndAppeals = async (claimType: ClaimType, page: number): Promise<ClaimsAndAppealsListPayload | undefined> => {
  const response = await get<ClaimsAndAppealsListPayload>('/v0/claims-and-appeals-overview', {
    'page[number]': page.toString(),
    'page[size]': DEFAULT_PAGE_SIZE.toString(),
    showCompleted: claimType === ClaimTypeConstants.ACTIVE ? 'false' : 'true',
  })
  return response
}

/**
 * Returns a query for user ClaimsAndAppeals
 */
export const useClaimsAndAppeals = (claimType: ClaimType, page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType, page],
    queryFn: () => getClaimsAndAppeals(claimType, page),
    meta: {
      errorName: 'getClaimsAndAppeals: Service error',
    },
  })
}

/**
 * Fetch user Claim
 */
export const getClaim = async (id: string): Promise<ClaimData | undefined> => {
  const newAbortController = new AbortController()
  const signal = newAbortController.signal
  const response = await get<ClaimGetData>(`/v0/claim/${id}`, {}, signal)
  return response?.data
}

/**
 * Returns a query for user Claim
 */
export const useClaim = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claim, id],
    queryFn: () => getClaim(id),
    meta: {
      errorName: 'getClaim: Service error',
    },
  })
}
