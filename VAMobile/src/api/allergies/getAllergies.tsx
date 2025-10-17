import { useQuery } from '@tanstack/react-query'

import { allergyKeys } from 'api/allergies/queryKeys'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AllergyListPayload } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch user Allergies
 */
const getAllergies = ({
  getOHAllergies = false,
}: {
  getOHAllergies?: boolean
}): Promise<AllergyListPayload | undefined> => {
  if (getOHAllergies) {
    return get<AllergyListPayload>('/v1/health/allergy-intolerances', {
      'page[number]': '1',
      'page[size]': LARGE_PAGE_SIZE.toString(),
      sort: 'date',
      useCache: 'false',
    })
  }
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
  const { data: authorizedServices } = useAuthorizedServices()

  return useQuery({
    ...options,
    queryKey: [allergyKeys.allergies],
    queryFn: () => getAllergies({ getOHAllergies: authorizedServices?.allergiesOracleHealthEnabled }),
    meta: {
      errorName: 'getAllergies: Service error',
    },
  })
}
