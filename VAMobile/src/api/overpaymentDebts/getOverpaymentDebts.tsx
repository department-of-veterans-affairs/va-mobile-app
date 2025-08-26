import { useQuery } from '@tanstack/react-query'

import { overpaymentDebtKeys } from 'api/overpaymentDebts/queryKeys'
import { OverpaymentDebtsPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch all overpayment debts for the current user
 */
export const getOverpaymentDebts = async (): Promise<OverpaymentDebtsPayload | undefined> => {
  const res = await get<OverpaymentDebtsPayload>('/v0/debts')
  if (res) return res
}

export const useOverpaymentDebts = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: overpaymentDebtKeys.overpaymentDebts,
    queryFn: () => getOverpaymentDebts(),
    meta: {
      errorName: 'getOverpaymentDebts: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
