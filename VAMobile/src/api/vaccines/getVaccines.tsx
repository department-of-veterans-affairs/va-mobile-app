import { useQuery } from '@tanstack/react-query'

import { VaccineListPayload } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

import { vaccineKeys } from './queryKeys'

/**
 * Fetch user Vaccines
 */
const getVaccines = async (page: number): Promise<VaccineListPayload | undefined> => {
  const response = await get<VaccineListPayload>('/v1/health/immunizations', {
    'page[number]': page.toString(),
    'page[size]': DEFAULT_PAGE_SIZE.toString(),
    sort: 'date',
  })
  return response
}

/**
 * Returns a query for user Vaccines
 */
export const useVaccines = (page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [vaccineKeys.vaccines, page],
    queryFn: () => getVaccines(page),
    meta: {
      errorName: 'getVaccines: Service error',
    },
  })
}
