import { TFunction } from 'i18next'

import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'

import { CategoryTypeFields, CategoryTypes, SecureMessagingMessageList } from 'store/api/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES, MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES, READ } from 'constants/secureMessaging'
import { MessageListItemObj, PickerItem, TextLineWithIconProps, VAIconProps } from 'components'
import { generateTestIDForTextIconList } from './common'
import { getFormattedDateTimeYear } from 'utils/formattingUtils'

export const getMessagesListItems = (
  messages: SecureMessagingMessageList,
  t: TFunction,
  onMessagePress: (messageID: number) => void,
  folderName?: string,
): Array<MessageListItemObj> => {
  return messages.map((message, index) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate, readReceipt, attachment, category } = attributes
    const isSentFolder = folderName === 'Sent'

    const unreadIconProps = readReceipt !== READ && !isSentFolder ? ({ name: 'UnreadIcon', width: 16, height: 16 } as VAIconProps) : undefined
    const paperClipProps = attachment ? ({ name: 'PaperClip', fill: 'spinner', width: 16, height: 16 } as VAIconProps) : undefined

    const textLines: Array<TextLineWithIconProps> = [
      {
        text: t('common:text.raw', { text: isSentFolder ? recipientName : senderName }),
        variant: 'MobileBodyBold',
        textAlign: 'left',
        color: 'primary',
        iconProps: unreadIconProps,
      },
      { text: t('common:text.raw', { text: formatSubject(category, subject, t), variant: 'MobileBody', textAlign: 'left', color: 'primary' }) },
      {
        text: t('common:text.raw', { text: getFormattedDateTimeYear(sentDate) }),
        variant: 'MobileBody',
        textAlign: 'left',
        color: 'primary',
        iconProps: paperClipProps,
      },
    ]

    return {
      textLinesWithIcon: textLines,
      isSentFolder: isSentFolder,
      readReceipt: readReceipt,
      onPress: () => onMessagePress(message.id),
      a11yHintText: t('secureMessaging.viewMessage.a11yHint'),
      testId: generateTestIDForTextIconList(textLines, t),
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
export const translateSubjectCategory = (category: CategoryTypes, t: TFunction): string => {
  switch (category) {
    case CategoryTypeFields.covid:
      return t('secureMessaging.composeMessage.covid')
    case CategoryTypeFields.test:
      return t('secureMessaging.composeMessage.test')
    case CategoryTypeFields.medication:
      return t('secureMessaging.composeMessage.medication')
    case CategoryTypeFields.appointment:
      return t('appointments.appointment')
    case CategoryTypeFields.other:
    case CategoryTypeFields.general:
      return t('secureMessaging.composeMessage.general')
    case CategoryTypeFields.education:
      return t('secureMessaging.composeMessage.education')
  }
  return category
}

/** Given the raw subject category and subject line attributes, we need to translate the category and then display
 * the two as separated by a colon and a space.
 * If there's no subjectLine, should only display subject category with no colon
 *
 * @param category - message attribute of categoryTypes indicating what category the message belongs to
 * @param subject - string from message attribute
 * @param t - translation function
 * */
export const formatSubject = (category: CategoryTypes, subject: string, t: TFunction): string => {
  const subjectCategory = translateSubjectCategory(category, t)
  const subjectLine = subject && subject !== '' ? `: ${subject}` : ''
  return `${subjectCategory}${subjectLine}`.trim()
}

export const getComposeMessageSubjectPickerOptions = (t: TFunction): Array<PickerItem> => {
  return [
    {
      value: CategoryTypeFields.other,
      label: t('secureMessaging.composeMessage.general'),
    },
    {
      value: CategoryTypeFields.covid,
      label: t('secureMessaging.composeMessage.covid'),
    },
    {
      value: CategoryTypeFields.appointment,
      label: t('appointments.appointment'),
    },
    {
      value: CategoryTypeFields.medication,
      label: t('secureMessaging.composeMessage.medication'),
    },
    {
      value: CategoryTypeFields.test,
      label: t('secureMessaging.composeMessage.test'),
    },
    {
      value: CategoryTypeFields.education,
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
  const docAndDocxValidTypes = [
    'doc',
    'docx',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'com.microsoft.word.doc',
    'org.openxmlformats.wordprocessingml.document',
  ]
  const imageValidTypes = ['jpeg', 'jpg', 'png', 'public.image', 'gif']
  const excelValidTypes = [
    'xls',
    'xlsx',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'com.microsoft.excel.xls',
    'org.openxmlformats.spreadsheetml.sheet',
  ]
  const textValidTypes = ['txt', 'pdf', 'text/plain', 'application/pdf', 'public.plain-text', 'com.adobe.pdf', 'rtf']

  const validFileTypes = [...docAndDocxValidTypes, ...imageValidTypes, ...excelValidTypes, ...textValidTypes]
  return !!validFileTypes.find((type) => fileType.includes(type))
}

/**
 * Selects a file from the devices file system, sets the error if an error is handled, otherwise calls callbackIfUri
 *
 * @param setError - function setting the error message
 * @param callbackIfUri - callback function called if there is no error with the file
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 * @param fileUris - list of already attached files uri values
 * @param t - translation function
 */
export const onFileFolderSelect = async (
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
  fileUris: Array<string>,
  t: TFunction,
): Promise<void> => {
  try {
    const document = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    })

    const { size, type, uri } = document

    if (fileUris.indexOf(uri) !== -1) {
      setError(t('secureMessaging.attachments.duplicateFileError'))
    } else if (!isValidAttachmentsFileType(type)) {
      setError(t('secureMessaging.attachments.fileTypeError'))
    } else if (size > MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES) {
      setError(t('secureMessaging.attachments.fileSizeError'))
    } else if (size + totalBytesUsed > MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES) {
      setError(t('secureMessaging.attachments.fileSumSizeError'))
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
 * @param imageBase64s - list of already attached images base64 values
 * @param t - translation function
 */
export const postCameraOrImageLaunchOnFileAttachments = (
  response: ImagePickerResponse,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
  imageBase64s: Array<string>,
  t: TFunction,
): void => {
  const { fileSize, errorMessage, uri, didCancel, type, base64 } = response

  if (didCancel) {
    return
  }

  if (!!base64 && imageBase64s.indexOf(base64) !== -1) {
    setError(t('secureMessaging.attachments.duplicateFileError'))
  } else if (!!type && !isValidAttachmentsFileType(type)) {
    setError(t('secureMessaging.attachments.fileTypeError'))
  } else if (!!fileSize && fileSize > MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES) {
    setError(t('secureMessaging.attachments.fileSizeError'))
  } else if (!!fileSize && fileSize + totalBytesUsed > MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES) {
    setError(t('secureMessaging.attachments.fileSumSizeError'))
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
 * @param fileUris - list of already attached files uri values
 * @param imageBase64s - list of already attached images base64 values
 */
export const onAddFileAttachments = (
  t: TFunction,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
  fileUris: Array<string>,
  imageBase64s: Array<string>,
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
          launchCamera({ mediaType: 'photo', quality: 0.9, includeBase64: true }, (response: ImagePickerResponse): void => {
            postCameraOrImageLaunchOnFileAttachments(response, setError, callbackIfUri, totalBytesUsed, imageBase64s, t)
          })
          break
        case 1:
          launchImageLibrary({ mediaType: 'photo', quality: 0.9, includeBase64: true }, (response: ImagePickerResponse): void => {
            postCameraOrImageLaunchOnFileAttachments(response, setError, callbackIfUri, totalBytesUsed, imageBase64s, t)
          })
          break
        case 2:
          onFileFolderSelect(setError, callbackIfUri, totalBytesUsed, fileUris, t)
          break
      }
    },
  )
}
