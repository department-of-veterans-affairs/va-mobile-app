import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SecureMessagingFormData, SecureMessagingMessageData, SendMessageParameters } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { Params, contentTypes, post } from 'store/api'
import { logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { secureMessagingKeys } from './queryKeys'

/**
 * Sends a message
 */
const sendMessage = async ({ messageData, replyToID, uploads }: SendMessageParameters) => {
  let postData: FormData | SecureMessagingFormData = messageData
  if (uploads && uploads.length !== 0) {
    const formData = new FormData()
    formData.append('message', JSON.stringify(messageData))

    uploads.forEach((attachment) => {
      let nameOfFile: string | undefined
      let typeOfFile: string | undefined
      let uriOfFile: string | undefined

      if ('assets' in attachment && attachment.assets && attachment.assets.length > 0) {
        const { fileName, type, uri } = attachment.assets[0]
        nameOfFile = fileName
        typeOfFile = type
        uriOfFile = uri
      } else if ('size' in attachment) {
        const { name, uri, type } = attachment
        nameOfFile = name
        typeOfFile = type
        uriOfFile = uri
      }
      formData.append(
        'uploads[]',
        JSON.parse(
          JSON.stringify({
            name: nameOfFile || '',
            uri: uriOfFile || '',
            type: typeOfFile || '',
          }),
        ),
      )
    })
    postData = formData
  }
  return post<SecureMessagingMessageData>(
    replyToID ? `/v0/messaging/health/messages/${replyToID}/reply` : '/v0/messaging/health/messages',
    postData as unknown as Params,
    uploads?.length !== 0 ? contentTypes.multipart : undefined,
  )
}

/**
 * Returns a mutation for sending a message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient()
  //   showSnackBar(messages.successMsg, dispatch, undefined, true, false, true) show snack bar on success or failure with retry on failure
  // logAnalyticsEvent(Events.vama_sm_send_message(totalTime, actionTime, messageData.category, replyToID)) add this one to the onSuccess in screen
  //const isReplyWithTriageError = replyToID && hasErrorCode(SecureMessagingErrorCodesConstants.TRIAGE_ERROR, error)
  //!isReplyWithTriageError && showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: async () => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      registerReviewEvent()
      queryClient.invalidateQueries({ queryKey: secureMessagingKeys.folders })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'sendMessage: Service error')
      }
    },
  })
}
