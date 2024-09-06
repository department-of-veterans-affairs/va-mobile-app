import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, VaccineListPayload } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

import { vaccineKeys } from './queryKeys'

/**
 * Fetch user Vaccines
 */
const getVaccines = (queryClient: QueryClient): Promise<VaccineListPayload | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.errors, (error) => {
      if (error.queryKey[0] === vaccineKeys.vaccines[0]) {
        throw error.error
      }
    })
  }

  return get<VaccineListPayload>('/v1/health/immunizations', {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'date',
    useCache: 'false',
  })
}

/**
 * Returns a query for user Vaccines
 */
export const useVaccines = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    queryKey: [vaccineKeys.vaccines],
    queryFn: () => getVaccines(queryClient),
    meta: {
      errorName: 'getVaccines: Service error',
    },
  })
}
