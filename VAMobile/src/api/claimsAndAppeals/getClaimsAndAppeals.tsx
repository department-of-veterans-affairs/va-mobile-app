import { useQuery } from '@tanstack/react-query'
import { chain, has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { ClaimsAndAppealsList, ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { ACTIVITY_STALE_TIME } from 'constants/common'
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
const getClaimsAndAppeals = async (claimType: ClaimType): Promise<ClaimsAndAppealsListPayload | undefined> => {
  const response = await get<ClaimsAndAppealsListPayload>('/v0/claims-and-appeals-overview', {
    'page[number]': '1',
    'page[size]': '5000',
    showCompleted: claimType === ClaimTypeConstants.ACTIVE ? 'false' : 'true',
    useCache: 'false',
  })

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
  const { data: authorizedServices } = useAuthorizedServices()
  const claimsAndAppealAccess = authorizedServices?.claims || authorizedServices?.appeals
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(claimsAndAppealAccess && (!claimsInDowntime || !appealsInDowntime) && queryEnabled),
    queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType],
    queryFn: () => getClaimsAndAppeals(claimType),
    meta: {
      errorName: 'getClaimsAndAppeals: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
