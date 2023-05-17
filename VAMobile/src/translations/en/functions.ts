import { SecureMessagingFolderList } from 'store/api/types'
import { SnackbarMessages } from 'components/SnackBar'
import { TFunction } from 'i18next'
import { getfolderName } from 'utils/secureMessaging'
import { profileAddressOptions, profileAddressType } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'

export const GenerateFolderMessage = (t: TFunction, folderID: number, folders: SecureMessagingFolderList, isUndo: boolean, isError: boolean): string => {
  let folderName = getfolderName(folderID.toString(), folders)
  if (folderName === 'Inbox' || folderName === 'Trash' || folderName === 'Drafts') {
    folderName = folderName.toLowerCase()
  }
  let messageString
  if (!isUndo && isError) {
    messageString = t('secureMessaging.folders.messageMovedError')
  } else if (!isUndo && !isError) {
    messageString = t('secureMessaging.folders.messageMoved')
  } else if (isUndo && isError) {
    messageString = t('secureMessaging.folders.messageMovedBackError')
  } else if (isUndo && !isError) {
    messageString = t('secureMessaging.folders.messageMovedBack')
  }
  return t('secureMessaging.folders.moveTo', { messageString: messageString, folderString: folderName })
}

export const GenerateAddressMessages = (t: TFunction, addressType: profileAddressType): SnackbarMessages => {
  let success, error
  if (addressType === profileAddressOptions.MAILING_ADDRESS) {
    success = t('contactInformation.mailingAddress.saved')
    error = t('contactInformation.mailingAddress.saved.error')
  } else {
    success = t('contactInformation.residentialAddress.saved')
    error = t('contactInformation.residentialAddress.saved.error')
  }
  const messages: SnackbarMessages = { successMsg: success, errorMsg: error }
  return messages
}
