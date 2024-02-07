import { ClaimDecisionResponseData } from 'api/types/ClaimsAndAppealsData'
import { claimsAndAppealsKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { post } from 'store/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Action to notify VA to make a claim decision
 */

export const submitClaimDecision = async (claimID: string) => {
  return post<ClaimDecisionResponseData>(`/v0/claim/${claimID}/request-decision`)
}

/**
 * Returns a mutation to make a claim decision
 */
export const useSubmitClaimDecision = (claimID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitClaimDecision,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [claimsAndAppealsKeys.claim, claimID] })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaimDecision: Service error')
      }
    },
  })
}
