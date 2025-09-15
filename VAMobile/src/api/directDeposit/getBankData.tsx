import { directDepositKeys } from 'api/directDeposit/queryKeys'
import { useQuery } from 'api/queryClient'
import { DirectDepositData } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch user direct deposit information
 */
const getBankData = (): Promise<DirectDepositData | undefined> => {
  return get<DirectDepositData>('/v0/payment-information/benefits')
}

/**
 * Returns a query for user direct deposit information
 */
export const useBankData = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: directDepositKeys.directDeposit,
    queryFn: () => getBankData(),
    meta: {
      errorName: 'getBankData: Service error',
    },
  })
}
