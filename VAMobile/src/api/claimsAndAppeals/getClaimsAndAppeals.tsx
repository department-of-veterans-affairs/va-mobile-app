import { useQuery } from '@tanstack/react-query'
import { chain } from 'underscore'

import { ClaimsAndAppealsList, ClaimsAndAppealsListPayload } from 'api/types/ClaimsAndAppealsData'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user ClaimsAndAppeals
 */
export const getClaimsAndAppeals = async (
  claimType: ClaimType,
  page: number,
): Promise<ClaimsAndAppealsListPayload | undefined> => {
  const response = await get<ClaimsAndAppealsListPayload>('/v0/claims-and-appeals-overview', {
    'page[number]': page.toString(),
    'page[size]': DEFAULT_PAGE_SIZE.toString(),
    showCompleted: claimType === ClaimTypeConstants.ACTIVE ? 'false' : 'true',
  })
  if (response) {
    response.data = sortByLatestDate(response.data)
  }
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

export const sortByLatestDate = (claimsAndAppeals: Array<ClaimsAndAppealsList>): Array<ClaimsAndAppealsList> => {
  return chain(claimsAndAppeals)
    .sortBy((claimAndAppeal) => new Date(claimAndAppeal.attributes.dateFiled))
    .sortBy((claimAndAppeal) => new Date(claimAndAppeal.attributes.updatedAt))
    .reverse()
    .value()
}
