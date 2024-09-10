import { useSelector } from 'react-redux'

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { errorKeys } from 'api/errors'
import { AuthorizedServicesPayload, ErrorData, UserAuthorizedServicesData } from 'api/types'
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
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === authorizedServicesKeys.authorizedServices[0]) {
        throw error.error
      }
    })
  }

  const response = await get<AuthorizedServicesPayload>('/v0/user/authorized-services')
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
