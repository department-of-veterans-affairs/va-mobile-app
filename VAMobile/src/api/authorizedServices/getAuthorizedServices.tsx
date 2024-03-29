import { useQuery } from '@tanstack/react-query'

import { AuthorizedServicesPayload, UserAuthorizedServicesData } from 'api/types'
import { get } from 'store/api'

import { authorizedServicesKeys } from './queryKeys'

/**
 * Fetch user demographics
 */
export const getAuthorizedServices = async (): Promise<UserAuthorizedServicesData | undefined> => {
  const response = await get<AuthorizedServicesPayload>('/v0/user/authorized-services')
  return response?.data.attributes.authorizedServices
}

/**
 * Returns a query for user demographics
 */
export const useAuthorizedServices = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: authorizedServicesKeys.authorizedServices,
    queryFn: () => getAuthorizedServices(),
    meta: {
      errorName: 'getAuthorizedServices: Service error',
    },
  })
}
