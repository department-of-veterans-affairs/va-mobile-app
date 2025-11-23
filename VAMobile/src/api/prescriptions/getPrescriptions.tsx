import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { prescriptionKeys } from 'api/prescriptions/queryKeys'
import { PrescriptionsGetData } from 'api/types'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

/**
 * Fetch user prescriptions
 */
const getPrescriptions = async ({
  useV1,
}: {
  useV1: boolean | undefined
}): Promise<PrescriptionsGetData | undefined> => {
  const params = {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'refill_status', // Parameters are snake case for the back end
  }
  const API_VERSION = useV1 ? 'v1' : 'v0'
  const response = await get<PrescriptionsGetData>(`/${API_VERSION}/health/rx/prescriptions`, params)

  // Diagnostic logging for v1 API to help identify isRefillable field issues
  if (__DEV__ && useV1 && response?.data) {
    console.debug(`[Prescriptions v1] Fetched ${response.data.length} prescriptions`)
    const refillableCount = response.data.filter((p) => p.attributes.isRefillable === true).length
    console.debug(`[Prescriptions v1] Refillable count: ${refillableCount}`)

    // Log first prescription structure for debugging
    if (response.data.length > 0) {
      const firstPrescription = response.data[0]
      console.debug('[Prescriptions v1] Sample prescription attributes:', {
        id: firstPrescription.id,
        hasIsRefillable: 'isRefillable' in firstPrescription.attributes,
        isRefillableValue: firstPrescription.attributes.isRefillable,
        isRefillableType: typeof firstPrescription.attributes.isRefillable,
        refillStatus: firstPrescription.attributes.refillStatus,
        refillRemaining: firstPrescription.attributes.refillRemaining,
      })
    }
  }

  return response
}

/**
 * Returns a query for user prescriptions
 */
export const usePrescriptions = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const { medicationsOracleHealthEnabled = false } = authorizedServices || {}

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.prescriptions && !rxInDowntime && queryEnabled),
    queryKey: prescriptionKeys.prescriptions,
    queryFn: () => getPrescriptions({ useV1: medicationsOracleHealthEnabled }),
    meta: {
      errorName: 'getPrescriptions: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
