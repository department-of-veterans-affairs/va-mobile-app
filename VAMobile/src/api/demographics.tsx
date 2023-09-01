import { useQuery } from '@tanstack/react-query'

import { DemographicsPayload, UserDemographics } from './types/DemographicsData'
import { get } from '../store/api'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

/**
 * Fetch user demographics
 */
export const getDemographics = async (): Promise<UserDemographics | undefined> => {
  try {
    const response = await get<DemographicsPayload>('/v0/user/demographics')
    return response?.data.attributes
  } catch (error) {
    if (isErrorObject(error)) {
      logNonFatalErrorToFirebase(error, 'getDemographics: Service error')
    }
    throw error
  }
}

/**
 * Returns a query for user demographics
 */
export const useDemographics = () => {
  return useQuery({
    queryKey: ['user', 'demographics'],
    queryFn: () => getDemographics(),
  })
}
