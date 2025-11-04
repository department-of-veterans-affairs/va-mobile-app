import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { prescriptionKeys } from 'api/prescriptions/queryKeys'
import { PrescriptionRefillData, PrescriptionsList, RefillRequestData, RefillRequestSummaryItems } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { Params, put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useReviewEvent } from 'utils/inAppReviews'

/**
 * Type guard to check if a failed prescription ID is a V1 object format
 */
const isV1FailedPrescriptionId = (failed: unknown): failed is { id: string; stationNumber: string } => {
  return typeof failed === 'object' && failed !== null && 'id' in failed && 'stationNumber' in failed
}

/**
 * Extracts the prescription ID from either V0 (string) or V1 (object) format
 */
const extractPrescriptionId = (failed: unknown, useV1: boolean): string => {
  if (useV1 && isV1FailedPrescriptionId(failed)) {
    return failed.id
  }
  return failed as string
}

/**
 * Requests refills for a users prescriptions
 */
const requestRefills = async (
  prescriptions: PrescriptionsList,
  useV1: boolean = false,
): Promise<RefillRequestSummaryItems> => {
  let results: RefillRequestSummaryItems = []

  const API_VERSION = useV1 ? 'v1' : 'v0'
  let requestBody: RefillRequestData

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
    requestBody as Params,
  )
  const failedPrescriptionIds =
    response?.data.attributes.failedPrescriptionIds?.map((failed) => extractPrescriptionId(failed, useV1)) || []
  results = prescriptions.map((prescription) => ({
    submitted: !failedPrescriptionIds?.includes(prescription.id),
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

  const registerReviewEvent = useReviewEvent(false, 'refillRequest')

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (prescriptions: PrescriptionsList) => requestRefills(prescriptions, medicationsOracleHealthEnabled),
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
