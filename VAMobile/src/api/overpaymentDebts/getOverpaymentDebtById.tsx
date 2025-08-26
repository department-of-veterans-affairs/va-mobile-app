import { useQuery } from '@tanstack/react-query'

import { overpaymentDebtKeys } from 'api/overpaymentDebts/queryKeys'
import { OverpaymentDebtPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch a specific overpayment debt by ID
 */
export const getOverpaymentDebtById = async (id: string): Promise<OverpaymentDebtPayload | undefined> => {
  const res = await get<OverpaymentDebtPayload>(`/v0/debts/${id}`)
  if (res) return res
}

export const useOverpaymentDebtById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: overpaymentDebtKeys.overpaymentDebtById,
    queryFn: () => getOverpaymentDebtById(id),
    meta: {
      errorName: 'getOverpaymentDebtById: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
