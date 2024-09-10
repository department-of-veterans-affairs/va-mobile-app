import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { AppealData, AppealGetData, ErrorData } from 'api/types'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user Appeal
 */
const getAppeal = async (
  id: string,
  abortSignal: AbortSignal,
  queryClient: QueryClient,
): Promise<AppealData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === claimsAndAppealsKeys.appeal[0]) {
        throw error.error
      }
    })
  }
  const response = await get<AppealGetData>(`/v0/appeal/${id}`, {}, abortSignal)
  return response?.data
}

/**
 * Returns a query for user Appeal
 */
export const useAppeal = (id: string, abortSignal: AbortSignal, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.appeal, id],
    queryFn: () => getAppeal(id, abortSignal, queryClient),
    meta: {
      errorName: 'getAppeal: Service error',
    },
  })
}
