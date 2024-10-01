import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { has } from 'underscore'

import { DemographicsPayload, UserDemographics } from 'api/types/DemographicsData'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { demographicsKeys } from './queryKeys'

/**
 * Fetch user demographics
 */
const getDemographics = async (queryClient: QueryClient): Promise<UserDemographics | undefined> => {
  const response = await get<DemographicsPayload>(
    '/v0/user/demographics',
    undefined,
    demographicsKeys.demographics,
    queryClient,
  )
  return response?.data.attributes
}

/**
 * Returns a query for user demographics
 */
export const useDemographics = (options?: { enabled?: boolean }) => {
  const profileUpdateInDowntime = useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(!profileUpdateInDowntime && queryEnabled),
    queryKey: demographicsKeys.demographics,
    queryFn: () => getDemographics(queryClient),
    meta: {
      errorName: 'getDemographics: Service error',
    },
  })
}
