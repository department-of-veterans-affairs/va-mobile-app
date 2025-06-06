import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'

import { secureMessagingKeys, useSaveDraft } from 'api/secureMessaging'
import { SaveDraftParameters, SecureMessagingFormData, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { logAnalyticsEvent } from 'utils/analytics'
import { useDestructiveActionSheet, useRouteNavigation, useTheme } from 'utils/hooks'

type ComposeCancelConfirmationProps = {
  /** Contents of the message */
  messageData: SecureMessagingFormData
  /** Whether or not the message is valid */
  isFormValid: boolean
  /** FormHeaderType describes type of message the draft is */
  origin: FormHeaderType
  /** id of the message the draft is replying to  */
  replyToID?: number
  /** id of draft message */
  draftMessageID?: number
}

export function useComposeCancelConfirmation(): [
  isDiscarded: boolean,
  composeCancelConfirmation: (props: ComposeCancelConfirmationProps) => void,
] {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const confirmationAlert = useDestructiveActionSheet()
  const goToDrafts = useGoToDrafts()
  const queryClient = useQueryClient()
  const [isDiscarded, setIsDiscarded] = useState(false)
  const { mutate: saveDraft } = useSaveDraft()

  return [
    isDiscarded,
    (props: ComposeCancelConfirmationProps) => {
      const { replyToID, messageData, draftMessageID, isFormValid, origin } = props
      const isReply = origin === FormHeaderTypeConstants.reply
      const isEditDraft = origin === FormHeaderTypeConstants.draft

      const onSaveDraft = (): void => {
        if (!isFormValid) {
          if (isReply && replyToID) {
            navigateTo('ReplyMessage', {
              messageID: replyToID,
              attachmentFileToAdd: {},
              attachmentFileToRemove: {},
              saveDraftConfirmFailed: true,
            })
          } else {
            navigateTo('StartNewMessage', { saveDraftConfirmFailed: true })
          }
        } else {
          const message = {
            ...messageData,
            draft_id: draftMessageID,
          }
          const params: SaveDraftParameters = { messageData: message, replyID: replyToID, messageID: draftMessageID }
          const mutateOptions = {
            onSuccess: () => {
              snackbar.show(t('secureMessaging.draft.saved'))
              logAnalyticsEvent(Events.vama_sm_save_draft(messageData.category))
              queryClient.invalidateQueries({
                queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
              })
              queryClient.invalidateQueries({
                queryKey: [secureMessagingKeys.message, draftMessageID],
              })
              navigateTo('FolderMessages', {
                folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
                folderName: FolderNameTypeConstants.drafts,
                draftSaved: true,
              })
            },
            onError: () => {
              snackbar.show(t('secureMessaging.draft.saved.error'), {
                isError: true,
                offset: theme.dimensions.snackBarBottomOffset,
                onActionPressed: () => saveDraft(params, mutateOptions),
              })
            },
          }
          saveDraft(params, mutateOptions)
        }
      }

      const onDiscard = (): void => {
        setIsDiscarded(true)
        if (isReply && replyToID) {
          navigateTo('ViewMessage', { messageID: replyToID })
        } else if (isEditDraft) {
          goToDrafts(false)
        } else {
          navigateTo('SecureMessaging', { activeTab: origin === 'Draft' ? 1 : 0 })
        }
      }

      confirmationAlert({
        title:
          origin === 'Compose'
            ? t('composeCancelConfirmation.compose.title')
            : origin === 'Draft'
              ? t('composeCancelConfirmation.draft.title')
              : t('composeCancelConfirmation.reply.title'),
        message: origin === 'Draft' ? t('composeCancelConfirmation.draft.body') : t('composeCancelConfirmation.body'),
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        buttons: [
          {
            text: t('keepEditing'),
          },
          {
            text: origin === 'Draft' ? t('deleteChanges') : t('delete'),
            onPress: onDiscard,
          },
          {
            text: origin === 'Draft' ? t('saveChanges') : t('save'),
            onPress: onSaveDraft,
          },
        ],
      })
    },
  ]
}

export function useGoToDrafts(): (draftSaved: boolean) => void {
  const navigateTo = useRouteNavigation()
  return (draftSaved: boolean): void => {
    navigateTo('FolderMessages', {
      folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
      folderName: FolderNameTypeConstants.drafts,
      draftSaved,
    })
  }
}
