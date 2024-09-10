import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { errorKeys } from 'api/errors'
import { ErrorData } from 'api/types'
import { DemographicsPayload, UserDemographics } from 'api/types/DemographicsData'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { demographicsKeys } from './queryKeys'

/**
 * Fetch user demographics
 */
const getDemographics = async (queryClient: QueryClient): Promise<UserDemographics | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === demographicsKeys.demographics[0]) {
        throw error.error
      }
    })
  }
  const response = await get<DemographicsPayload>('/v0/user/demographics')
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
