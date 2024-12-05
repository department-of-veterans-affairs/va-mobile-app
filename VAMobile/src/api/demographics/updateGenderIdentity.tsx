import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Events, UserAnalytics } from 'constants/analytics'
import { put } from 'store/api'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useReviewEvent } from 'utils/inAppReviews'

import { demographicsKeys } from './queryKeys'

/**
 * Updates a user's gender identity
 */
const updateGenderIdentity = (genderIdentity: string) => {
  return put('/v0/user/gender_identity', { code: genderIdentity })
}

/**
 * Returns a mutation for updating gender identity
 */
export const useUpdateGenderIdentity = () => {
  const registerReviewEvent = useReviewEvent()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGenderIdentity,
    onSuccess: () => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      logAnalyticsEvent(Events.vama_gender_id_success())
      queryClient.invalidateQueries({ queryKey: demographicsKeys.demographics })
      registerReviewEvent()
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updateGenderIdentity: Service error')
      }
      logAnalyticsEvent(Events.vama_gender_id_fail())
    },
  })
}
