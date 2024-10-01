import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { chain, has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { ClaimsAndAppealsList, ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

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
  queryClient: QueryClient,
): Promise<ClaimsAndAppealsListPayload | undefined> => {
  const response = await get<ClaimsAndAppealsListPayload>(
    '/v0/claims-and-appeals-overview',
    {
      'page[number]': '1',
      'page[size]': LARGE_PAGE_SIZE.toString(),
      showCompleted: claimType === ClaimTypeConstants.ACTIVE ? 'false' : 'true',
      useCache: 'false',
    },
    claimsAndAppealsKeys.claimsAndAppeals,
    queryClient,
  )

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
export const useClaimsAndAppeals = (claimType: ClaimType, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  const { data: authorizedServices } = useAuthorizedServices()
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)

  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const claimsAndAppealAccess = authorizedServices?.claims || authorizedServices?.appeals
  const closedClaimsAndAppealsQueryKey = [claimsAndAppealsKeys.claimsAndAppeals, ClaimTypeConstants.CLOSED]

  return useQuery({
    ...options,
    enabled: !!(claimsAndAppealAccess && (!claimsInDowntime || !appealsInDowntime) && queryEnabled),
    queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType],
    queryFn: () => {
      if (claimType === ClaimTypeConstants.ACTIVE && !queryClient.getQueryData(closedClaimsAndAppealsQueryKey)) {
        // Prefetch closed claims when active claims are being fetched so that closed
        // claims will already be loaded if a user views the closed claims tab.
        queryClient.prefetchQuery({
          queryKey: closedClaimsAndAppealsQueryKey,
          queryFn: () => getClaimsAndAppeals(ClaimTypeConstants.CLOSED, queryClient),
          staleTime: ACTIVITY_STALE_TIME,
        })
      }

      return getClaimsAndAppeals(claimType, queryClient)
    },
    meta: {
      errorName: 'getClaimsAndAppeals: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
