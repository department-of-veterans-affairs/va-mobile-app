import { SecureMessagingFolderList, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { TFunction } from 'i18next'
import { getfolderName } from 'utils/secureMessaging'

export const GenerateFolderMessage = (t: TFunction, folderID: number, folders: SecureMessagingFolderList, isUndo: boolean, isError: boolean): string => {
  const folderName = getfolderName(folderID.toString(), folders)
  let messageString
  const folderString =
    folderID !== SecureMessagingSystemFolderIdConstants.INBOX && folderID !== SecureMessagingSystemFolderIdConstants.DELETED
      ? t('secureMessaging.folder', { folderName })
      : folderName
  if (!isUndo && isError) {
    messageString = t('secureMessaging.folders.messageMovedError')
  } else if (!isUndo && !isError) {
    messageString = t('secureMessaging.folders.messageMoved')
  } else if (isUndo && isError) {
    messageString = t('secureMessaging.folders.messageMovedBackError')
  } else if (isUndo && !isError) {
    messageString = t('secureMessaging.folders.messageMovedBack')
  }
  return t('secureMessaging.folders.moveTo', { messageString: messageString, folderString: folderString })
}
