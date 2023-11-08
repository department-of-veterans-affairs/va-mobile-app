import { useQuery } from '@tanstack/react-query'

import { DemographicsPayload, UserDemographics } from 'api/types/DemographicsData'
import { demographicsKeys } from './queryKeys'
import { get } from 'store/api'

/**
 * Fetch user demographics
 */
const getDemographics = async (): Promise<UserDemographics | undefined> => {
  const response = await get<DemographicsPayload>('/v0/user/demographics')
  return response?.data.attributes
}

/**
 * Returns a query for user demographics
 */
export const useDemographics = () => {
  return useQuery({
    queryKey: demographicsKeys.demographics,
    queryFn: () => getDemographics(),
    meta: {
      errorName: 'getDemographics: Service error',
    },
  })
}
