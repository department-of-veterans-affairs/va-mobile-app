import { useQuery, useQueryClient } from '@tanstack/react-query'
import { has } from 'underscore'

import { authKeys } from 'api/auth/queryKeys'
import { AuthorizedServicesPayload, UserAuthSettings, UserAuthorizedServicesData } from 'api/types'
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
  const queryClient = useQueryClient()
  const userSettings = queryClient.getQueryData(authKeys.settings) as UserAuthSettings
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(userSettings.loggedIn && queryEnabled),
    queryKey: authorizedServicesKeys.authorizedServices,
    queryFn: () => getAuthorizedServices(),
    meta: {
      errorName: 'getAuthorizedServices: Service error',
    },
    staleTime: 300000, // 5 minutes
  })
}
