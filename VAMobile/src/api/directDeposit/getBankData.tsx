import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { DirectDepositData } from 'api/types'
import { get } from 'store/api'

import { directDepositKeys } from './queryKeys'

/**
 * Fetch user direct deposit information
 */
const getBankData = (queryClient: QueryClient): Promise<DirectDepositData | undefined> => {
  return get<DirectDepositData>(
    '/v0/payment-information/benefits',
    undefined,
    directDepositKeys.directDeposit,
    queryClient,
  )
}

/**
 * Returns a query for user direct deposit information
 */
export const useBankData = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: directDepositKeys.directDeposit,
    queryFn: () => getBankData(queryClient),
    meta: {
      errorName: 'getBankData: Service error',
    },
  })
}
