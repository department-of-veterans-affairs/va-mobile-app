import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PrescriptionsGetData } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'
import { useDowntime } from 'utils/hooks'

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
  const { data: authorizedServices } = useAuthorizedServices()
  const rxInDowntime = useDowntime('rx_refill')
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
