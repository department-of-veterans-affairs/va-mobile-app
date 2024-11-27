import { useQuery } from '@tanstack/react-query'

import { AllergyListPayload } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

import { allergyKeys } from './queryKeys'

/**
 * Fetch user Allergies
 */
const getAllergies = (): Promise<AllergyListPayload | undefined> => {
  return get<AllergyListPayload>('/v0/health/allergy-intolerances', {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'date',
    useCache: 'false',
  })
}

/**
 * Returns a query for user Allergies
 */
export const useAllergies = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [allergyKeys.allergies],
    queryFn: () => getAllergies(),
    meta: {
      errorName: 'getAllergies: Service error',
    },
  })
}
