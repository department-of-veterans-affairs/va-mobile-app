import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MoveMessageParameters } from 'api/types'
import { Params, patch } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

import { secureMessagingKeys } from './queryKeys'

/**
 * Moves a user's message from one folder to another
 */
const moveMessage = ({ messageID, newFolderID }: MoveMessageParameters) => {
  return patch(`/v0/messaging/health/messages/${messageID}/move`, {
    folder_id: newFolderID,
  } as unknown as Params)
}

/**
 * Returns a mutation for moving a message from one folder to another
 */
export const useMoveMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moveMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: secureMessagingKeys.folders })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'moveMessage: Service error')
      }
    },
  })
}
