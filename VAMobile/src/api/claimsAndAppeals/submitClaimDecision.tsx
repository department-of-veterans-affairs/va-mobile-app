import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ClaimData, ClaimDecisionResponseData } from 'api/types'
import { post } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { claimsAndAppealsKeys } from './queryKeys'

/**
 * Notifes VA to make a claim decision
 */

const submitClaimDecision = (claimID: string) => {
  return post<ClaimDecisionResponseData>(`/v0/claim/${claimID}/request-decision`)
}

/**
 * Returns a mutation to make a claim decision
 */
export const useSubmitClaimDecision = (claimID: string) => {
  const queryClient = useQueryClient()
  const claimData = queryClient.getQueryData([claimsAndAppealsKeys.claim, claimID]) as ClaimData
  claimData.attributes.waiverSubmitted = true

  return useMutation({
    mutationFn: submitClaimDecision,
    onSuccess: () => {
      queryClient.setQueryData([claimsAndAppealsKeys.claim, claimID], claimData)
      queryClient.invalidateQueries({ queryKey: [claimsAndAppealsKeys.claim, claimID] })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaimDecision: Service error')
      }
    },
  })
}
