import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthSettings } from 'api/auth/getAuthSettings'
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
  const authSettingsQuery = useAuthSettings()
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authSettingsQuery.data?.loggedIn && queryEnabled),
    queryKey: authorizedServicesKeys.authorizedServices,
    queryFn: () => getAuthorizedServices(),
    meta: {
      errorName: 'getAuthorizedServices: Service error',
    },
    staleTime: 300000, // 5 minutes
  })
}
