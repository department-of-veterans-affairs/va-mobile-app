import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SaveEmailData } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { Params as APIParams, EditResponseData, post, put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { contactInformationKeys } from './queryKeys'

/**
 * Creates or updates a user's email depending on whether the `id` field is present
 */
const saveEmail = (emailData: SaveEmailData) => {
  const endpoint = '/v0/user/emails'

  if (emailData.id) {
    return put<EditResponseData>(endpoint, emailData as unknown as APIParams)
  }

  return post<EditResponseData>(endpoint, emailData as unknown as APIParams)
}

/**
 * Returns a mutation for saving an email
 */
export const useSaveEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveEmail,
    onSuccess: () => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      logAnalyticsEvent(Events.vama_prof_update_email())
      queryClient.invalidateQueries({ queryKey: contactInformationKeys.contactInformation })
      registerReviewEvent()
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'saveEmail: Service error')
      }
    },
  })
}
