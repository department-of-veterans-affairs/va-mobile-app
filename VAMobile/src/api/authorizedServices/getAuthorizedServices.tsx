import { useSelector } from 'react-redux'

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { has } from 'underscore'

import { AuthorizedServicesPayload, UserAuthorizedServicesData } from 'api/types'
import { RootState } from 'store'
import { get } from 'store/api'
import { AuthState } from 'store/slices'

import { authorizedServicesKeys } from './queryKeys'

/**
 * Fetch user demographics
 */
export const getAuthorizedServices = async (
  queryClient: QueryClient,
): Promise<UserAuthorizedServicesData | undefined> => {
  const response = await get<AuthorizedServicesPayload>(
    '/v0/user/authorized-services',
    undefined,
    authorizedServicesKeys.authorizedServices,
    queryClient,
  )
  return response?.data.attributes.authorizedServices
}

/**
 * Returns a query for user demographics
 */
export const useAuthorizedServices = (options?: { enabled?: boolean }) => {
  const { loggedIn } = useSelector<RootState, AuthState>((state) => state.auth)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(loggedIn && queryEnabled),
    queryKey: authorizedServicesKeys.authorizedServices,
    queryFn: () => getAuthorizedServices(queryClient),
    meta: {
      errorName: 'getAuthorizedServices: Service error',
    },
    staleTime: 300000, // 5 minutes
  })
}
