import { useQuery } from '@tanstack/react-query'

import { PrescriptionTrackingInfo, PrescriptionTrackingInfoGetData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { get } from 'store/api'
import { setAnalyticsUserProperty } from 'utils/analytics'

import { prescriptionKeys } from './queryKeys'

/**
 * Fetch user prescription tracking information
 */
const getTrackingInfo = async (id: string): Promise<Array<PrescriptionTrackingInfo> | undefined> => {
  const response = await get<PrescriptionTrackingInfoGetData>(`/v0/health/rx/prescriptions/${id}/tracking`)
  setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
  return response?.data
}

/**
 * Returns a query for user prescription tracking information
 */
export const useTrackingInfo = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [prescriptionKeys.trackingInfo, id],
    queryFn: () => getTrackingInfo(id),
    meta: {
      errorName: 'getTrackingInfo: Service error',
    },
  })
}
