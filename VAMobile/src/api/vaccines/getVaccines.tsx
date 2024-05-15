import { useQuery } from '@tanstack/react-query'

import { VaccineListPayload } from 'api/types'
import { get } from 'store/api'

import { vaccineKeys } from './queryKeys'

/**
 * Fetch user Vaccines
 */
const getVaccines = (): Promise<VaccineListPayload | undefined> => {
  return get<VaccineListPayload>('/v1/health/immunizations', {
    'page[number]': '1',
    'page[size]': '5000',
    sort: 'date',
    useCache: 'false',
  })
}

/**
 * Returns a query for user Vaccines
 */
export const useVaccines = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [vaccineKeys.vaccines],
    queryFn: () => getVaccines(),
    meta: {
      errorName: 'getVaccines: Service error',
    },
  })
}
