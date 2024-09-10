import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { errorKeys } from 'api/errors'
import { ErrorData, PrescriptionsGetData } from 'api/types'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { prescriptionKeys } from './queryKeys'

/**
 * Fetch user prescriptions
 */
const getPrescriptions = (queryClient: QueryClient): Promise<PrescriptionsGetData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === prescriptionKeys.prescriptions[0]) {
        throw error.error
      }
    })
  }
  const params = {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'refill_status', // Parameters are snake case for the back end
  }
  return get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
}

/**
 * Returns a query for user prescriptions
 */
export const usePrescriptions = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.prescriptions && !rxInDowntime && queryEnabled),
    queryKey: prescriptionKeys.prescriptions,
    queryFn: () => getPrescriptions(queryClient),
    meta: {
      errorName: 'getPrescriptions: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
