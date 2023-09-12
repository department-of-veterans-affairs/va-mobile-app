import { useQuery } from '@tanstack/react-query'

import { AuthorizedServicesPayload, UserAuthorizedServicesData } from 'api/types/AuthorizedServicesData'
import { authroizedServicesKeys } from './queryKeys'
import { get } from 'store/api'

/**
 * Fetch user demographics
 */
export const getAuthorizedServices = async (): Promise<UserAuthorizedServicesData | undefined> => {
  try {
    const response = await get<AuthorizedServicesPayload>('/v0/user/authorized-services')
    return response?.data.attributes.authorizedServices
  } catch (error) {
    throw error
  }
}

/**
 * Returns a query for user demographics
 */
export const useAuthorizedServices = () => {
  return useQuery({
    queryKey: authroizedServicesKeys.authroizedServices,
    queryFn: () => getAuthorizedServices(),
    meta: {
      errorName: 'getAuthorizedServices: Service error',
    },
  })
}
