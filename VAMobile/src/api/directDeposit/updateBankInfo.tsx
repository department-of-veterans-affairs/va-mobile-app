import { useMutation, useQueryClient } from '@tanstack/react-query'
import { includes } from 'lodash'

import { PaymentAccountData } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { DirectDepositErrors } from 'constants/errors'
import { APIError, put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { getErrorKeys } from 'utils/errors'

import { directDepositKeys } from './queryKeys'

/**
 * Updates a user's direct deposit information
 */
const updateBankInfo = (paymentAccountData: PaymentAccountData) => {
  paymentAccountData.financialInstitutionName = 'Bank' // api requires a name but ignores the value in the backend
  return put('/v0/payment-information/benefits', paymentAccountData)
}

/**
 * Returns a mutation for updating direct deposit information
 */
export const useUpdateBankInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBankInfo,
    onSuccess: async () => {
      logAnalyticsEvent(Events.vama_update_dir_dep())
      setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      queryClient.invalidateQueries({ queryKey: directDepositKeys.directDeposit })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updateBankInfo: Service error')
      }
    },
  })
}

export const checkIfRoutingNumberIsInvalid = (error: APIError): boolean => {
  if (!error) {
    return false
  }

  const errorKeys = getErrorKeys(error)
  return (
    includes(errorKeys, DirectDepositErrors.INVALID_ROUTING_NUMBER) ||
    includes(error?.text, DirectDepositErrors.INVALID_ROUTING_NUMBER_TEXT)
  )
}
