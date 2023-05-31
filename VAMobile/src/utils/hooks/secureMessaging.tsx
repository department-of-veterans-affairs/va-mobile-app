import { NAMESPACE } from 'constants/namespaces'
import { imageDocumentResponseType, useDestructiveAlert } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

export type UseSaveDraftAttachmentAlertProps = {
  /** array of message attachments */
  attachments: Array<imageDocumentResponseType>
  /** save draft dispatch */
  onConfirm: () => void
}
export const useSaveDraftAttachmentAlert = () => {
  const alert = useDestructiveAlert()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  return (props: UseSaveDraftAttachmentAlertProps) => {
    const { attachments, onConfirm } = props
    if (attachments.length) {
      alert({
        title: t('secureMessaging.draft.cantSaveAttachments'),
        cancelButtonIndex: 0,
        buttons: [
          {
            text: t('secureMessaging.keepEditing'),
          },
          {
            text: t('secureMessaging.saveDraft'),
            onPress: onConfirm,
          },
        ],
      })
    } else {
      onConfirm()
    }
  }
}
