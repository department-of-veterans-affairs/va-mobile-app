import { useQuery } from '@tanstack/react-query'
import { chain } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { ClaimsAndAppealsList, ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { DowntimeFeatureTypeConstants, get } from 'store/api'
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
  page: number,
): Promise<ClaimsAndAppealsListPayload | undefined> => {
  const response = await get<ClaimsAndAppealsListPayload>('/v0/claims-and-appeals-overview', {
    'page[number]': page.toString(),
    'page[size]': DEFAULT_PAGE_SIZE.toString(),
    showCompleted: claimType === ClaimTypeConstants.ACTIVE ? 'false' : 'true',
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
export const useClaimsAndAppeals = (claimType: ClaimType, page: number, options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const claimsAndAppealAccess = authorizedServices?.claims || authorizedServices?.appeals
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)
  const queryEnabled = options && Object.hasOwn(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: claimsAndAppealAccess && (!claimsInDowntime || !appealsInDowntime) && queryEnabled,
    queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType, page],
    queryFn: () => getClaimsAndAppeals(claimType, page),
    meta: {
      errorName: 'getClaimsAndAppeals: Service error',
    },
  })
}
