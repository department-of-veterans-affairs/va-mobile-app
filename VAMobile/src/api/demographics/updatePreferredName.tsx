import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Events, UserAnalytics } from 'constants/analytics'
import { put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { demographicsKeys } from './queryKeys'

/**
 * Updates a user's preferred name
 */
const updatePreferredName = (preferredName: string) => {
  const preferredNameUpdateData = {
    text: preferredName,
  }
  return put('/v0/user/preferred_name', preferredNameUpdateData)
}

/**
 * Returns a mutation for updating preferred name
 */
export const useUpdatePreferredName = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePreferredName,
    onSuccess: () => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_preferred_name())
      logAnalyticsEvent(Events.vama_pref_name_success())
      queryClient.invalidateQueries({ queryKey: demographicsKeys.demographics })
      registerReviewEvent()
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updatePreferredName: Service error')
      }
      logAnalyticsEvent(Events.vama_pref_name_fail())
    },
  })
}
