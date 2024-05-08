import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PhoneData } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { Params as APIParams, EditResponseData, del } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { contactInformationKeys } from './queryKeys'

/**
 * Deletes a user's phone number
 */
const deletePhoneNumber = (phoneData: PhoneData) => {
  return del<EditResponseData>('/v0/user/phones', phoneData as unknown as APIParams)
}

/**
 * Returns a mutation for deleting a phone number
 */
export const useDeletePhoneNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePhoneNumber,
    onSuccess: () => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      logAnalyticsEvent(Events.vama_prof_update_phone())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deletePhoneNumber: Service error')
      }
    },
  })
}
