import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Events, UserAnalytics } from 'constants/analytics'
import { demographicsKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { put } from 'store/api'

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGenderIdentity,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      await logAnalyticsEvent(Events.vama_gender_id_success)
      queryClient.invalidateQueries({ queryKey: demographicsKeys.demographics })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updateGenderIdentity: Service error')
      }
      await logAnalyticsEvent(Events.vama_gender_id_fail)
    },
  })
}
