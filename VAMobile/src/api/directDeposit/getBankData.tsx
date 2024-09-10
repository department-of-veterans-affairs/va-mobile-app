import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { DirectDepositData, ErrorData } from 'api/types'
import { get } from 'store/api'

import { directDepositKeys } from './queryKeys'

/**
 * Fetch user direct deposit information
 */
const getBankData = (queryClient: QueryClient): Promise<DirectDepositData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === directDepositKeys.directDeposit[0]) {
        throw error.error
      }
    })
  }
  return get<DirectDepositData>('/v0/payment-information/benefits')
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
