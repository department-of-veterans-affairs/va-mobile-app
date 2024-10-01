import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { AppealData, AppealGetData } from 'api/types'
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
  const response = await get<AppealGetData>(
    `/v0/appeal/${id}`,
    {},
    claimsAndAppealsKeys.appeal,
    queryClient,
    abortSignal,
  )
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
