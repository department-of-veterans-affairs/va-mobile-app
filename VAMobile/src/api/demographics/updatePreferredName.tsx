import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Events, UserAnalytics } from 'constants/analytics'
import { demographicsKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { put } from 'store/api'

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
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_preferred_name())
      await logAnalyticsEvent(Events.vama_pref_name_success)
      queryClient.invalidateQueries({ queryKey: demographicsKeys.demographics })
    },
    onError: async (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'updatePreferredName: Service error')
      }
      await logAnalyticsEvent(Events.vama_pref_name_fail)
    },
  })
}
