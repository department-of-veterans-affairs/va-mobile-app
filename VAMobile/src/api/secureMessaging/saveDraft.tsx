import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SaveDraftParameters, SecureMessagingSaveDraftData, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { Params, post, put } from 'store/api'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { secureMessagingKeys } from './queryKeys'

/**
 * Creates or updates a user's draft message depending on whether the `message id` field is present
 */
const saveDraft = ({ messageID, replyID, messageData }: SaveDraftParameters) => {
  const url = replyID
    ? `/v0/messaging/health/message_drafts/${replyID}/replydraft`
    : '/v0/messaging/health/message_drafts'

  return Promise.reject('oh no')

  if (messageID) {
    return put<SecureMessagingSaveDraftData>(`${url}/${messageID}`, messageData as unknown as Params)
  }

  return post<SecureMessagingSaveDraftData>(url, messageData as unknown as Params)
}

/**
 * Returns a mutation for saving a draft message
 */
export const useSaveDraft = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: secureMessagingKeys.folders })
      queryClient.invalidateQueries({
        queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
      })
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
