import { useQuery } from '@tanstack/react-query'

import { PrescriptionsGetData } from 'api/types'
import { get } from 'store/api'

import { prescriptionKeys } from './queryKeys'

/**
 * Fetch user prescriptions
 */
const getPrescriptions = (): Promise<PrescriptionsGetData | undefined> => {
  const params = {
    'page[number]': '1',
    'page[size]': '5000',
    sort: 'refill_status', // Parameters are snake case for the back end
  }
  return get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
}

/**
 * Returns a query for user prescriptions
 */
export const usePrescriptions = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: prescriptionKeys.prescriptions,
    queryFn: () => getPrescriptions(),
    meta: {
      errorName: 'getPrescriptions: Service error',
    },
  })
}
