import { useMemo } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { debtKeys } from 'api/debts/queryKeys'
import { DebtsPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { Params, get } from 'store/api'

type DebtsSummary = { amountDue: number; count: number }

/**
 * Compute debt summary from the full debt data payload
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
export const getDebts = async (countOnly?: boolean): Promise<DebtsPayload | undefined> => {
  const params: Params = countOnly ? { countOnly: 'true' } : {}
  const res = await get<DebtsPayload>('/v0/debts', params)
  return res
}

/**
 * Hook to fetch all debts for the current user with computed summary
 */
export const useDebts = (options?: { enabled?: boolean }) => {
  const query = useQuery({
    ...options,
    queryKey: debtKeys.debts,
    queryFn: () => getDebts(false),
    meta: {
      errorName: 'getDebts: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })

  const summary = useMemo(() => buildDebtsSummary(query.data), [query.data])

  return { ...query, summary }
}

/**
 * Hook to fetch just the count of debts for the current user
 */
export const useDebtsCount = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: debtKeys.debtsCount,
    queryFn: async () => {
      const result = await getDebts(true)

      // If count-only query returns zero, pre-populate the full query cache
      // so the full query won't need to fetch later
      if (result?.debtsCount === 0) {
        queryClient.setQueryData(debtKeys.debts, { data: [] })
      }

      return result
    },
    select: (data) => data?.debtsCount ?? 0,
    meta: {
      errorName: 'getDebtsCount: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
