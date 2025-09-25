import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { prescriptionKeys } from 'api/prescriptions/queryKeys'
import { PrescriptionRefillData, PrescriptionsList, RefillRequestSummaryItems } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { Params, put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useReviewEvent } from 'utils/inAppReviews'
import { waygateEnabled } from 'utils/waygateConfig'

// Adjust the import path if needed

/**
 * Requests refills for a users prescriptions
 */
const requestRefills = async (
  prescriptions: PrescriptionsList,
  useV1: boolean = false,
): Promise<RefillRequestSummaryItems> => {
  let results: RefillRequestSummaryItems = []

  const API_VERSION = useV1 ? 'v1' : 'v0'
  let requestBody: { ids: string[] } | Array<{ id: string; stationNumber: string }>

  if (useV1) {
    // v1 API expects SingleRefillRequest[]
    requestBody = prescriptions.map((prescription) => ({
      id: prescription.id,
      stationNumber: prescription.attributes.stationNumber,
    }))
  } else {
    // v0 API expects { ids: string[] }
    requestBody = {
      ids: prescriptions.map((prescription) => prescription.id),
    }
  }
  const response = await put<PrescriptionRefillData>(
    `/${API_VERSION}/health/rx/prescriptions/refill`,
    requestBody as unknown as Params,
  )
  const failedPrescriptionIds = response?.data.attributes.failedPrescriptionIds || []
  results = prescriptions.map((prescription) => ({
    submitted: !failedPrescriptionIds.includes(prescription.id),
    data: prescription,
  }))
  return results
}

/**
 * Returns a mutation for requesting refills for a users prescriptions
 */
export const useRequestRefills = () => {
  const { data: authorizedServices } = useAuthorizedServices()
  const { medicationsOracleHealthEnabled = false } = authorizedServices || {}
  const { enabled: oracleMedsEnabled } = waygateEnabled('WG_MedsOracleHealthApiEnabled')
  const shouldUseV1 = medicationsOracleHealthEnabled && oracleMedsEnabled

  console.log('in prescription hooks', {
    oracleMedsEnabled,
    medicationsOracleHealthEnabled,
    shouldUseV1,
  })

  const registerReviewEvent = useReviewEvent(false, 'refillRequest')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (prescriptions: PrescriptionsList) => requestRefills(prescriptions, shouldUseV1),
    onMutate: () => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
    },
    onSuccess(data, variables) {
      const prescriptionIds = variables.map((prescription) => prescription.id)
      logAnalyticsEvent(Events.vama_rx_refill_success(prescriptionIds))
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.prescriptions })
      registerReviewEvent()
    },
    onError: (error, variables) => {
      const prescriptionIds = variables.map((prescription) => prescription.id)
      logAnalyticsEvent(Events.vama_rx_refill_fail(prescriptionIds))
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'requestRefills: Service error')
      }
    },
  })
}
