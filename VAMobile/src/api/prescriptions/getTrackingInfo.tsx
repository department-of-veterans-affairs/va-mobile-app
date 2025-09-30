import { useQuery } from '@tanstack/react-query'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePrescriptions } from 'api/prescriptions/getPrescriptions'
import { prescriptionKeys } from 'api/prescriptions/queryKeys'
import {
  PrescriptionData,
  PrescriptionTrackingInfo,
  PrescriptionTrackingInfoGetData,
  PrescriptionTrackingItem,
  PrescriptionsList,
} from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { get } from 'store/api'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { waygateEnabled } from 'utils/waygateConfig'

/**
 * Fetch user prescription tracking information
 */
const getTrackingInfo = async (id: string): Promise<Array<PrescriptionTrackingInfo> | undefined> => {
  const response = await get<PrescriptionTrackingInfoGetData>(`/v0/health/rx/prescriptions/${id}/tracking`)
  setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
  return response?.data
}

const getTrackingDataForPrescription = async ({
  id,
  prescriptionData,
}: {
  id: string
  prescriptionData: PrescriptionsList | undefined
}): Promise<Array<PrescriptionTrackingInfo> | undefined> => {
  // find the perscription with the id in the prescriptionData
  const prescription = prescriptionData?.find((p: PrescriptionData) => p.id === id)
  if (!prescription || !prescription.attributes.tracking) {
    return undefined
  }
  // convert PrescriptionData to an Array<PrescriptionTrackingInfo>
  const rv = prescription.attributes.tracking
    ? prescription.attributes.tracking.map<PrescriptionTrackingInfo>((t: PrescriptionTrackingItem) => ({
        id: String(t.prescriptionId),
        type: 'prescriptionTrackingInfo',
        attributes: {
          prescriptionId: t.prescriptionId,
          prescriptionName: t.prescriptionName,
          prescriptionNumber: t.prescriptionNumber,
          ndcNumber: t.ndcNumber,
          trackingNumber: t.trackingNumber,
          shippedDate: t.shippedDate,
          carrier: t.carrier,
          otherPrescriptions: t.otherPrescriptions,
        },
      }))
    : []
  console.log('getTrackingDataForPrescription returning', rv)
  return rv
}
/**
 * Returns a query for user prescription tracking information
 */
export const useTrackingInfo = (id: string, options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const { medicationsOracleHealthEnabled = false } = authorizedServices || {}
  const { enabled: oracleMedsEnabled } = waygateEnabled('WG_MedsOracleHealthApiEnabled')

  const shouldUseV1 = medicationsOracleHealthEnabled && oracleMedsEnabled
  const { data: prescriptionData } = usePrescriptions()

  // The data for v1 is already on the prescription data
  return useQuery({
    ...options,
    queryKey: [prescriptionKeys.trackingInfo, id],
    queryFn: () => {
      if (shouldUseV1) {
        return getTrackingDataForPrescription({
          id,
          prescriptionData: prescriptionData?.data,
        })
      }
      return getTrackingInfo(id)
    },
    meta: {
      errorName: 'getTrackingInfo: Service error',
    },
  })
}
