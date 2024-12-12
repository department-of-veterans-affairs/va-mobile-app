import { useSelector } from 'react-redux'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { includes } from 'lodash'

import { DirectDepositData, PaymentAccountData } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { DirectDepositErrors } from 'constants/errors'
import { RootState } from 'store'
import { APIError, put } from 'store/api'
import { DemoState } from 'store/slices/demoSlice'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { getErrorKeys } from 'utils/errors'
import { useReviewEvent } from 'utils/inAppReviews'

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
  const registerReviewEvent = useReviewEvent()
  const queryClient = useQueryClient()
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)

  return useMutation({
    mutationFn: updateBankInfo,
    onSuccess: async (data, newAccountData) => {
      logAnalyticsEvent(Events.vama_update_dir_dep())
      setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      if (demoMode) {
        // have to manually set the data in demo mode. Would be fixed with moving over to MSW for api call mocking
        const queryData = queryClient.getQueryData(directDepositKeys.directDeposit) as DirectDepositData
        const updatedData = { ...newAccountData }
        updatedData.financialInstitutionName = 'FIRST CITIZENS BANK & TRUST COMPANY'
        updatedData.accountNumber = updatedData.accountNumber.replace(/\d(?=\d{4})/, '#')
        queryData.data.attributes.paymentAccount = updatedData
        queryClient.setQueryData(directDepositKeys.directDeposit, queryData)
      } else {
        queryClient.invalidateQueries({ queryKey: directDepositKeys.directDeposit })
      }
      registerReviewEvent()
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
