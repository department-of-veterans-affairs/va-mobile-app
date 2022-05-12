import { FolderNameTypeConstants, FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFormData, SecureMessagingSystemFolderIdConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import { resetHasLoadedRecipients, resetSaveDraftComplete, resetSaveDraftFailed, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/slices'
import { useDestructiveAlert, useRouteNavigation, useTranslation } from 'utils/hooks'
import { useDispatch } from 'react-redux'

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
export function useComposeCancelConfirmation(): (props: ComposeCancelConfirmationProps) => void {
  const t = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const confirmationAlert = useDestructiveAlert()
  const goToDrafts = useGoToDrafts()

  return (props: ComposeCancelConfirmationProps) => {
    const { replyToID, messageData, draftMessageID, isFormValid, origin } = props
    const isReply = origin === FormHeaderTypeConstants.reply
    const isEditDraft = origin === FormHeaderTypeConstants.draft

    const resetAlerts = () => {
      dispatch(resetSendMessageFailed())
      dispatch(resetSaveDraftComplete())
      dispatch(resetSaveDraftFailed())
      dispatch(resetHasLoadedRecipients())
    }

    const onSaveDraft = (): void => {
      if (!isFormValid) {
        navigateTo('ComposeMessage', { saveDraftConfirmFailed: true })()
      } else {
        dispatch(saveDraft(messageData, draftMessageID, !!replyToID, replyToID, true))
        dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.FOLDERS))
      }
    }

    const onDiscard = (): void => {
      resetAlerts()
      if (isReply && replyToID) {
        navigateTo('ViewMessageScreen', { messageID: replyToID })()
      } else if (isEditDraft) {
        goToDrafts(false)
      } else {
        navigateTo('SecureMessaging')()
      }
    }

    confirmationAlert({
      title: t('secureMessaging.composeMessage.cancel.saveDraftQuestion'),
      message: t('secureMessaging.composeMessage.cancel.saveDraftDescription'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('common:cancel'),
        },
        {
          text: t('secureMessaging.composeMessage.cancel.discard'),
          onPress: onDiscard,
        },
        {
          text: t('secureMessaging.composeMessage.cancel.saveDraft'),
          onPress: onSaveDraft,
        },
      ],
    })
  }
}

export function useGoToDrafts(): (draftSaved: boolean) => void {
  const navigateTo = useRouteNavigation()
  return (draftSaved: boolean): void => {
    navigateTo('FolderMessages', {
      folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
      folderName: FolderNameTypeConstants.drafts,
      draftSaved,
    })()
  }
}
