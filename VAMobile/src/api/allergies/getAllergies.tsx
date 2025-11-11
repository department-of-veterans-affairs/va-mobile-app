import { useQuery } from '@tanstack/react-query'

import { allergyKeys } from 'api/allergies/queryKeys'
import { AllergyListPayload } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch user Allergies
 */
const getAllergies = ({ isV1Api = false }: { isV1Api?: boolean }): Promise<AllergyListPayload | undefined> => {
  const API_VERSION = isV1Api ? 'v1' : 'v0'
  return get<AllergyListPayload>(`/${API_VERSION}/health/allergy-intolerances`, {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'date',
    useCache: 'false',
  })
}

/**
 * Returns a query for user Allergies
 */
export const useAllergies = (options?: { enabled?: boolean; isV1Api?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [allergyKeys.allergies],
    queryFn: () => getAllergies({ isV1Api: options?.isV1Api }),
    meta: {
      errorName: 'getAllergies: Service error',
    },
  })
}
