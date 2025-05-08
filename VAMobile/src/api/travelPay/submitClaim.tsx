import { useMutation } from '@tanstack/react-query'

import { SubmitSMOCTravelPayClaimParameters, SubmitTravelPayClaimResponseData } from 'api/types'
import { Params as APIParams, post } from 'store/api/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

const submitClaim = async (smocTravelPayClaimData: SubmitSMOCTravelPayClaimParameters) => {
  const endpoint = '/v0/travel-pay-claims' //TODO: Add endpoint
  return post<SubmitTravelPayClaimResponseData>(endpoint, smocTravelPayClaimData as unknown as APIParams)
}

/**
 * Returns a mutation for submitting a travel pay claim
 */
export const useSubmitTravelClaim = () => {
  //TODO: modify saved data to include travel pay claim
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitClaim,
    onSuccess: () => {
      //TODO: modify saved data to include travel pay claim
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaim: Service error')
      }
    },
  })
}
