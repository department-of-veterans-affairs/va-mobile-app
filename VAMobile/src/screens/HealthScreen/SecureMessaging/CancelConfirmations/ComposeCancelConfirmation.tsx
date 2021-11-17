import { FolderNameTypeConstants, FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFormData, SecureMessagingSystemFolderIdConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import { resetHasLoadedRecipients, resetSaveDraftComplete, resetSaveDraftFailed, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/actions'
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

    const goToDrafts = (draftSaved: boolean): void => {
      navigateTo('FolderMessages', {
        folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
        folderName: FolderNameTypeConstants.drafts,
        draftSaved,
      })()
    }

    const onSaveDraft = (): void => {
      if (!isFormValid) {
        navigateTo('ComposeMessage', { saveDraftConfirmFailed: true })()
      } else {
        dispatch(saveDraft(messageData, draftMessageID, !!replyToID, replyToID, true))
        dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.FOLDERS))
        resetAlerts()

        // If we've been to the drafts folder before, we can go directly there.  Otherwise, we want to pop back to the SecureMessaging
        // screen first, then add the Drafts folder to the stack
        if (isEditDraft) {
          goToDrafts(true)
        } else {
          navigateTo('SecureMessaging')()
          goToDrafts(true)
        }
      }
    }

    const onCancel = (): void => {
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
      buttons: [
        {
          text: t('secureMessaging.composeMessage.cancel.discard'),
          onPress: onCancel,
        },
        {
          text: t('secureMessaging.composeMessage.cancel.saveDraft'),
          onPress: onSaveDraft,
        },
      ],
    })
  }
}
