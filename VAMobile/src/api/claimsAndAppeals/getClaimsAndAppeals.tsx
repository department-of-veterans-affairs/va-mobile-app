import { useQuery } from '@tanstack/react-query'
import { chain } from 'underscore'

import { ClaimsAndAppealsList, ClaimsAndAppealsListPayload } from 'api/types'
import { Events } from 'constants/analytics'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'
import { logAnalyticsEvent } from 'utils/analytics'

import { claimsAndAppealsKeys } from './queryKeys'

const sortByLatestDate = (claimsAndAppeals: Array<ClaimsAndAppealsList>): Array<ClaimsAndAppealsList> => {
  return chain(claimsAndAppeals)
    .sortBy((claimAndAppeal) => new Date(claimAndAppeal.attributes.dateFiled))
    .sortBy((claimAndAppeal) => new Date(claimAndAppeal.attributes.updatedAt))
    .reverse()
    .value()
}

/**
 * Fetch user ClaimsAndAppeals
 */
const getClaimsAndAppeals = async (
  claimType: ClaimType,
  page: number,
  claimsFirstRetrieval?: boolean,
): Promise<ClaimsAndAppealsListPayload | undefined> => {
  const response = await get<ClaimsAndAppealsListPayload>('/v0/claims-and-appeals-overview', {
    'page[number]': page.toString(),
    'page[size]': DEFAULT_PAGE_SIZE.toString(),
    showCompleted: claimType === ClaimTypeConstants.ACTIVE ? 'false' : 'true',
  })

  if (claimsFirstRetrieval && response?.meta.activeClaimsCount) {
    logAnalyticsEvent(Events.vama_hs_claims_count(response.meta.activeClaimsCount))
  }
  if (response) {
    return {
      ...response,
      data: sortByLatestDate(response.data),
    }
  }
}

/**
 * Returns a query for user ClaimsAndAppeals
 */
export const useClaimsAndAppeals = (
  claimType: ClaimType,
  page: number,
  claimsFirstRetrieval?: boolean,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType, page],
    queryFn: () => getClaimsAndAppeals(claimType, page, claimsFirstRetrieval),
    meta: {
      errorName: 'getClaimsAndAppeals: Service error',
    },
  })
}
