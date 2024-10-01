import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PrescriptionsGetData } from 'api/types'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { prescriptionKeys } from './queryKeys'

/**
 * Fetch user prescriptions
 */
const getPrescriptions = (): Promise<PrescriptionsGetData | undefined> => {
  const params = {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'refill_status', // Parameters are snake case for the back end
  }
  return get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params, prescriptionKeys.prescriptions)
}

/**
 * Returns a query for user prescriptions
 */
export const usePrescriptions = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.prescriptions && !rxInDowntime && queryEnabled),
    queryKey: prescriptionKeys.prescriptions,
    queryFn: () => getPrescriptions(),
    meta: {
      errorName: 'getPrescriptions: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
