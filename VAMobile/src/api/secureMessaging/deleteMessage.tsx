import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DeleteMessageParameters } from 'api/types'
import { del } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { secureMessagingKeys } from './queryKeys'

/**
 * deletes a user's message based on `message id` field
 */
const deleteMessage = async ({ messageID }: DeleteMessageParameters) => {
  return del(`/v0/messaging/health/messages/${messageID}`)
}

/**
 * Returns a mutation for deleting a message
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  //snackbar stuff showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
  //showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
  //[secureMessagingKeys.folderMessages, folderID, page] invalidate the query in onSuccess block for the corresponding usage area
  // on move to trash folder if that is available newFolderID === SecureMessagingSystemFolderIdConstants.DELETED use useDelete instead of useMove
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: secureMessagingKeys.folders })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'deleteMessage: Service error')
      }
    },
  })
}
