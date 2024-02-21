import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SaveDraftParameters, SecureMessagingSaveDraftData } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { Params, post, put } from 'store/api'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { secureMessagingKeys } from './queryKeys'

/**
 * Creates or updates a user's draft message depending on whether the `message id` field is present
 */
const saveDraft = async ({ messageID, replyID, messageData }: SaveDraftParameters) => {
  let response
  if (messageID) {
    const url = replyID
      ? `/v0/messaging/health/message_drafts/${replyID}/replydraft/${messageID}`
      : `/v0/messaging/health/message_drafts/${messageID}`
    response = await put<SecureMessagingSaveDraftData>(url, messageData as unknown as Params)
  } else {
    const url = replyID
      ? `/v0/messaging/health/message_drafts/${replyID}/replydraft`
      : '/v0/messaging/health/message_drafts'
    response = await post<SecureMessagingSaveDraftData>(url, messageData as unknown as Params)
  }
  return response
}

/**
 * Returns a mutation for saving a draft message
 */
export const useSaveDraft = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveDraft,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: secureMessagingKeys.folders })
      setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      registerReviewEvent()
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'saveDraft: Service error')
      }
    },
  })
}
