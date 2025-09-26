import { useMemo } from 'react'

import { debtKeys } from 'api/debts/queryKeys'
import { useQuery } from 'api/queryClient'
import { DebtsPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

type DebtsSummary = { amountDue: number; count: number }

/**
 * Compute debt summary from the payload
 */
const buildDebtsSummary = (payload?: DebtsPayload): DebtsSummary => {
  const items = payload?.data ?? []
  const toNum = (n: number | string) => (typeof n === 'number' ? n : parseFloat(String(n ?? 0)) || 0)

  const amountDue = items.reduce((sum, d) => sum + toNum(d?.attributes?.currentAr), 0)
  const count = items.filter((d) => toNum(d?.attributes?.currentAr) > 0).length

  return { amountDue, count }
}

/**
 * Fetch all debts for the current user
 */
export const getDebts = async (): Promise<DebtsPayload | undefined> => {
  const res = await get<DebtsPayload>('/v0/debts')
  if (res) return res
}

export const useDebts = (options?: { enabled?: boolean }) => {
  const query = useQuery({
    ...options,
    queryKey: debtKeys.debts,
    queryFn: getDebts,
    meta: {
      errorName: 'getDebts: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
  const summary = useMemo(() => buildDebtsSummary(query.data), [query.data])
  return { ...query, summary }
}
