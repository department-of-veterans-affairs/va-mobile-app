import { useQuery } from '@tanstack/react-query'

import { debtKeys } from 'api/debts/queryKeys'
import { DebtsPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch all debts for the current user
 */
export const getDebts = async (): Promise<DebtsPayload | undefined> => {
  const res = await get<DebtsPayload>('/v0/debts')
  if (res) return res
}

export const useDebts = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: debtKeys.debts,
    queryFn: () => getDebts(),
    meta: {
      errorName: 'getDebts: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
