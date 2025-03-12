import { TFunction } from 'i18next'

import { SecureMessagingFolderList } from 'api/types'
import {
  profileAddressOptions,
  profileAddressType,
} from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { getfolderName } from 'utils/secureMessaging'

export const GenerateFolderMessage = (
  t: TFunction,
  folderID: number,
  folders: SecureMessagingFolderList,
  isUndo: boolean,
  isError: boolean,
): string => {
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

export const GenerateAddressMessage = (t: TFunction, addressType: profileAddressType, isError: boolean): string => {
  if (addressType === profileAddressOptions.MAILING_ADDRESS) {
    return isError ? t('contactInformation.mailingAddress.saved.error') : t('contactInformation.mailingAddress.saved')
  } else {
    return isError
      ? t('contactInformation.residentialAddress.saved.error')
      : t('contactInformation.residentialAddress.saved')
  }
}
