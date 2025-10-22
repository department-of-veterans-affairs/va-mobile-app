import { useQuery } from '@tanstack/react-query'

import { allergyKeys } from 'api/allergies/queryKeys'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AllergyListPayload } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch user Allergies
 */
const getAllergies = ({ useV1 = false }: { useV1?: boolean }): Promise<AllergyListPayload | undefined> => {
  const API_VERSION = useV1 ? 'v1' : 'v0'
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
export const useAllergies = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()

  const shouldUseV1 =
    authorizedServices?.allergiesOracleHealthEnabled && featureEnabled('allergiesOracleHealthApiEnabled')

  return useQuery({
    ...options,
    queryKey: [allergyKeys.allergies],
    queryFn: () => getAllergies({ useV1: shouldUseV1 }),
    meta: {
      errorName: 'getAllergies: Service error',
    },
  })
}
