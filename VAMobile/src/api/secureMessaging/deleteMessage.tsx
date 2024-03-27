import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DeleteMessageParameters } from 'api/types'
import { del } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { secureMessagingKeys } from './queryKeys'

/**
 * deletes a user's message based on `message id` field
 */
const deleteMessage = ({ messageID }: DeleteMessageParameters) => {
  return del(`/v0/messaging/health/messages/${messageID}`)
}

/**
 * Returns a mutation for deleting a message
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: secureMessagingKeys.folders })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deleteMessage: Service error')
      }
    },
  })
}
