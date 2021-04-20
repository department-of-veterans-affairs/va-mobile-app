import { TFunction } from 'i18next'

import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'

import { CategoryTypeFields, CategoryTypes, SecureMessagingMessageList } from 'store/api/types'
import { DefaultListItemObj, PickerItem, TextLine } from 'components'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES, MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES } from 'constants/secureMessaging'
import { getFormattedDateTimeYear } from 'utils/formattingUtils'
import { getTestIDFromTextLines } from 'utils/accessibility'

export const getMessagesListItems = (
  messages: SecureMessagingMessageList,
  t: TFunction,
  onMessagePress: (messageID: number) => void,
  folderName?: string,
): Array<DefaultListItemObj> => {
  return messages.map((message, index) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate, category } = attributes
    const subjectCategory = formatSubjectCategory(category, t)
    const subjectLine = subject ? `: ${subject}` : ''

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: folderName === 'Sent' ? recipientName : senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: `${subjectCategory}${subjectLine}`.trim() }) },
      { text: t('common:text.raw', { text: getFormattedDateTimeYear(sentDate) }) },
    ]

    return {
      textLines,
      onPress: () => onMessagePress(message.id),
      a11yHintText: t('secureMessaging.viewMessage.a11yHint'),
      testId: getTestIDFromTextLines(textLines),
      a11yValue: t('common:listPosition', { position: index + 1, total: messages.length }),
    }
  })
}

/** Category attribute is given in all caps. Need to convert to regular capitalization unless category is 'COVID'
 * Function also converts categories to associated translation value
 *
 * @param category - message attribute of categoryTypes indicating what category the message belongs to
 * @param t - translation function
 * */
export const formatSubjectCategory = (category: CategoryTypes, t: TFunction): string => {
  switch (category) {
    case CategoryTypeFields.covid:
      return t('secureMessaging.composeMessage.covid')
    case CategoryTypeFields.test:
      return t('secureMessaging.composeMessage.test')
    case CategoryTypeFields.medication:
      return t('secureMessaging.composeMessage.medication')
    case CategoryTypeFields.appointment:
      return t('secureMessaging.composeMessage.appointment')
    case CategoryTypeFields.other:
    case CategoryTypeFields.general:
      return t('secureMessaging.composeMessage.general')
    case CategoryTypeFields.education:
      return t('secureMessaging.composeMessage.education')
  }
  return category
}

export const getComposeMessageSubjectPickerOptions = (t: TFunction): Array<PickerItem> => {
  return [
    {
      value: '',
      label: '',
    },
    {
      value: t('secureMessaging.composeMessage.general'),
      label: t('secureMessaging.composeMessage.general'),
    },
    {
      value: t('secureMessaging.composeMessage.covid'),
      label: t('secureMessaging.composeMessage.covid'),
    },
    {
      value: t('appointments.appointment'),
      label: t('appointments.appointment'),
    },
    {
      value: t('secureMessaging.composeMessage.medication'),
      label: t('secureMessaging.composeMessage.medication'),
    },
    {
      value: t('secureMessaging.composeMessage.test'),
      label: t('secureMessaging.composeMessage.test'),
    },
    {
      value: t('secureMessaging.composeMessage.education'),
      label: t('secureMessaging.composeMessage.education'),
    },
  ]
}

/**
 * Returns true if the given file type is a doc, docx, jpeg, jpg, gif, txt, pdf, png, rtf, xlx, or xlsx file
 *
 * @param fileType - given file type to check if valid
 */
const isValidAttachmentsFileType = (fileType: string): boolean => {
  const validFileTypes = ['doc', 'docx', 'jpeg', 'jpg', 'gif', 'text/plain', 'txt', 'pdf', 'png', 'rtf', 'xls', 'xlsx']
  return !!validFileTypes.find((type) => fileType.includes(type))
}

/**
 * Selects a file from the devices file system, sets the error if an error is handled, otherwise calls callbackIfUri
 *
 * @param setError - function setting the error message
 * @param callbackIfUri - callback function called if there is no error with the file
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 */
export const onFileFolderSelect = async (
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
): Promise<void> => {
  try {
    const document = await DocumentPicker.pick({
      type: [DocumentPicker.types.images, DocumentPicker.types.plainText, DocumentPicker.types.pdf],
    })

    const { size, type } = document

    // TODO: update error messages
    if (size > MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES) {
      setError('FILE SIZE ERROR')
    } else if (size + totalBytesUsed > MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES) {
      setError('SUM OF FILE SIZES ERROR')
    } else if (!isValidAttachmentsFileType(type)) {
      setError('INVALID FILE TYPE ERROR')
    } else {
      setError('')
      callbackIfUri(document, false)
    }
  } catch (docError) {
    if (DocumentPicker.isCancel(docError)) {
      return
    }

    setError(docError.code)
  }
}

/**
 * After the camera takes a photo or a photo is selected from the gallery, if an error exists setError is called to display
 * the error message. If there is no error and the image uri exists, callbackIfUri is called.
 *
 * @param response - response with image data given after image is taken or selected
 * @param setError - function setting the error message
 * @param callbackIfUri - callback function called if there is no error with the image and the uri exists
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 */
export const postCameraOrImageLaunchOnFileAttachments = (
  response: ImagePickerResponse,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
): void => {
  const { fileSize, errorMessage, uri, didCancel } = response

  if (didCancel) {
    return
  }

  // TODO: update error messages
  if (!!fileSize && fileSize > MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES) {
    setError('FILE SIZE ERROR')
  } else if (!!fileSize && fileSize + totalBytesUsed > MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES) {
    setError('SUM OF FILE SIZES ERROR')
  } else if (!!response.type && !isValidAttachmentsFileType(response.type)) {
    setError('INVALID FILE TYPE ERROR')
  } else if (errorMessage) {
    setError(errorMessage)
  } else {
    setError('')

    if (uri) {
      callbackIfUri(response, true)
    }
  }
}

/**
 * Opens up an action sheet with the options to open the camera, camera roll, the devices file folders,
 * or cancel. On click of one of the options, it's corresponding action is implemented (launching the
 * camera or camera roll or the device's folders).
 *
 * @param t - translation function
 * @param showActionSheetWithOptions - hook to open the action sheet
 * @param setError - sets error message
 * @param callbackIfUri - callback when a file is selected or taken with the camera successfully
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 */
export const onAddFileAttachments = (
  t: TFunction,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
): void => {
  const options = [t('common:camera'), t('common:photoGallery'), t('common:fileFolder'), t('common:cancel')]

  showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: 3,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          launchCamera({ mediaType: 'photo', quality: 0.9 }, (response: ImagePickerResponse): void => {
            postCameraOrImageLaunchOnFileAttachments(response, setError, callbackIfUri, totalBytesUsed)
          })
          break
        case 1:
          launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, (response: ImagePickerResponse): void => {
            postCameraOrImageLaunchOnFileAttachments(response, setError, callbackIfUri, totalBytesUsed)
          })
          break
        case 2:
          onFileFolderSelect(setError, callbackIfUri, totalBytesUsed)
          break
      }
    },
  )
}
