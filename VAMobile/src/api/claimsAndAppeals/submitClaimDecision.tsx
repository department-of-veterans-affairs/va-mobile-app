import { SetDataOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals/queryKeys'
import { ClaimData, ClaimDecisionResponseData } from 'api/types'
import { post } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

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
      const setDataOptions: SetDataOptions = {
        updatedAt: DateTime.now().toMillis(),
      }
      queryClient.setQueryData([claimsAndAppealsKeys.claim, claimID], claimData, setDataOptions)
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaimDecision: Service error')
      }
    },
  })
}
