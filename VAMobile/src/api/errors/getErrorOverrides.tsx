import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { ErrorData } from 'api/types'

import { errorKeys } from './queryKeys'

/**
 * Fetch user message based on message ID
 */
const getErrorOverrides = async (queryClient: QueryClient): Promise<ErrorData> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  return data || { overrideErrors: [] }
}

/**
 * Returns a query for a user message based message ID
 */
export const useErrorOverrides = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    staleTime: Infinity,
    queryKey: [errorKeys.errorOverrides],
    queryFn: () => getErrorOverrides(queryClient),
    meta: {
      errorName: 'getErrorOverrides: Service error',
    },
  })
}
