import { useQuery } from '@tanstack/react-query'

import { AppealData, AppealGetData } from 'api/types'
import { get } from 'store/api'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Fetch user Appeal
 */
const getAppeal = async (id: string): Promise<AppealData | undefined> => {
  const response = await get<AppealGetData>(`/v0/appeal/${id}`, {})
  return response?.data
}

/**
 * Returns a query for user Appeal
 */
export const useAppeal = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [claimsAndAppealsKeys.appeal, id],
    queryFn: () => getAppeal(id),
    meta: {
      errorName: 'getAppeal: Service error',
    },
  })
}
