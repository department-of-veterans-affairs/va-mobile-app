import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PrescriptionRefillData, PrescriptionsList, RefillRequestSummaryItems } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useReviewEvent } from 'utils/inAppReviews'

import { prescriptionKeys } from './queryKeys'

/**
 * Requests refills for a users prescriptions
 */
const requestRefills = async (prescriptions: PrescriptionsList): Promise<RefillRequestSummaryItems> => {
  let results: RefillRequestSummaryItems = []
  const prescriptionIds = prescriptions.map((prescription) => prescription.id)
  const response = await put<PrescriptionRefillData>('/v0/health/rx/prescriptions/refill', {
    ids: prescriptionIds,
  })
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
  const registerReviewEvent = useReviewEvent(false, 'refillRequest')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: requestRefills,
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
