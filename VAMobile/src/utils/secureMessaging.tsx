import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TFunction } from 'i18next'
import DocumentPicker from 'react-native-document-picker'
import _ from 'underscore'

import { CategoryTypeFields, CategoryTypes, SecureMessagingFolderList, SecureMessagingMessageList } from 'store/api/types'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Events } from 'constants/analytics'
import {
  FolderNameTypeConstants,
  MAX_IMAGE_DIMENSION,
  MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES,
  MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES,
  READ,
  TRASH_FOLDER_NAME,
} from 'constants/secureMessaging'
import { InlineTextWithIconsProps, MessageListItemObj, PickerItem, VAIconProps } from 'components'
import { generateTestIDForInlineTextIconList, isErrorObject } from './common'
import { getFormattedMessageTime, stringToTitleCase } from 'utils/formattingUtils'
import { imageDocumentResponseType, useDestructiveActionSheetProps } from './hooks'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from './analytics'
import theme from 'styles/themes/standardTheme'

const MAX_SUBJECT_LENGTH = 50

export const getMessagesListItems = (
  messages: SecureMessagingMessageList,
  t: TFunction,
  onMessagePress: (messageID: number, isDraft?: boolean) => void,
  folderName?: string,
): Array<MessageListItemObj> => {
  return messages.map((message, index) => {
    const { attributes } = message
    const { attachment, recipientName, senderName, subject, sentDate, readReceipt, hasAttachments, category } = attributes
    const isSentFolder = folderName === FolderNameTypeConstants.sent
    const isDraftsFolder = folderName === FolderNameTypeConstants.drafts
    const isOutbound = isSentFolder || isDraftsFolder

    const unreadIconProps = readReceipt !== READ && !isOutbound ? ({ name: 'Unread', width: 16, height: 16, fill: theme.colors.icon.unreadMessage } as VAIconProps) : undefined
    const paperClipProps = hasAttachments || attachment ? ({ name: 'PaperClip', fill: 'spinner', width: 16, height: 16 } as VAIconProps) : undefined

    const textLines: Array<InlineTextWithIconsProps> = [
      {
        leftTextProps: {
          text: t('text.raw', {
            text: `${isDraftsFolder ? t('secureMessaging.viewMessage.draftPrefix') : ''}${isOutbound ? stringToTitleCase(recipientName) : stringToTitleCase(senderName)}`,
          }),
          variant: 'MobileBodyBold',
          textAlign: 'left',
        },
        leftIconProps: unreadIconProps,
        rightTextProps: {
          text: t('text.raw', { text: getFormattedMessageTime(sentDate) }),
          variant: 'MobileBody',
          textAlign: 'right',
        },
      },
      {
        leftTextProps: {
          text: t('text.raw', { text: formatSubject(category, subject, t) }),
          variant: 'MobileBody',
          textAlign: 'left',
        },
        leftIconProps: paperClipProps,
        rightIconProps: {
          name: 'ChevronRight',
          width: theme.dimensions.chevronListItemWidth,
          height: theme.dimensions.chevronListItemHeight,
          fill: theme.colors.icon.chevronListItem,
        } as VAIconProps,
      },
    ]

    const folder = (): string => {
      switch (folderName) {
        case FolderNameTypeConstants.sent:
          return 'sent'
        case FolderNameTypeConstants.inbox:
          return 'inbox'
        case FolderNameTypeConstants.deleted:
          return 'deleted'
        case FolderNameTypeConstants.drafts:
          return 'drafts'
        default:
          return 'custom'
      }
    }

    return {
      inlineTextWithIcons: textLines,
      isSentFolder: isSentFolder,
      readReceipt: readReceipt,
      onPress: () => {
        logAnalyticsEvent(Events.vama_sm_open(message.id, folder(), readReceipt !== READ && !isOutbound ? 'unread' : 'read'))
        onMessagePress(message.id, isDraftsFolder)
      },
      a11yHintText: isDraftsFolder ? t('secureMessaging.viewMessage.draft.a11yHint') : t('secureMessaging.viewMessage.a11yHint'),
      testId: generateTestIDForInlineTextIconList(textLines, t),
      a11yValue: t('listPosition', { position: index + 1, total: messages.length }),
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
      return t('secureMessaging.startNewMessage.covid')
    case CategoryTypeFields.test:
      return t('secureMessaging.startNewMessage.test')
    case CategoryTypeFields.medication:
      return t('secureMessaging.startNewMessage.medication')
    case CategoryTypeFields.appointment:
      return t('appointments.appointment')
    case CategoryTypeFields.other:
    case CategoryTypeFields.general:
      return t('secureMessaging.startNewMessage.general')
    case CategoryTypeFields.education:
      return t('secureMessaging.startNewMessage.education')
  }
  return category
}

/** Given the raw category and subject attributes, we need to translate the category and then display
 * the two as separated by a colon and a space.
 * If there's no subject, should only display category with no colon
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

export const getStartNewMessageCategoryPickerOptions = (t: TFunction): Array<PickerItem> => {
  return [
    {
      value: CategoryTypeFields.other,
      label: t('secureMessaging.startNewMessage.general'),
    },
    {
      value: CategoryTypeFields.covid,
      label: t('secureMessaging.startNewMessage.covid'),
    },
    {
      value: CategoryTypeFields.appointment,
      label: t('appointments.appointment'),
    },
    {
      value: CategoryTypeFields.medication,
      label: t('secureMessaging.startNewMessage.medication'),
    },
    {
      value: CategoryTypeFields.test,
      label: t('secureMessaging.startNewMessage.test'),
    },
    {
      value: CategoryTypeFields.education,
      label: t('secureMessaging.startNewMessage.education'),
    },
  ]
}

/**
 * Function to determine invalid subject length
 * @returns Callback function that returns true if subject length invalid (over 50 characters)
 */
export const SubjectLengthValidationFn = (subject: string) => {
  const InvalidSubjectLength = (): boolean => {
    return subject.length > MAX_SUBJECT_LENGTH
  }
  return InvalidSubjectLength
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
  setErrorA11y: (errorA11y: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
  fileUris: Array<string>,
  t: TFunction,
): Promise<void> => {
  const {
    pickSingle,
    isCancel,
    types: { allFiles },
  } = DocumentPicker

  try {
    const document = (await pickSingle({
      type: [allFiles],
    })) as DocumentPickerResponse

    const { size, type, uri } = document

    if (fileUris.indexOf(uri) !== -1) {
      setError(t('secureMessaging.attachments.duplicateFileError'))
    } else if (!isValidAttachmentsFileType(type)) {
      setError(t('secureMessaging.attachments.fileTypeError'))
    } else if (size > MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES) {
      setError(t('secureMessaging.attachments.fileSizeError'))
      setErrorA11y(t('secureMessaging.attachments.fileSizeError.A11yLabel'))
    } else if (size + totalBytesUsed > MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES) {
      setError(t('secureMessaging.attachments.fileSumSizeError'))
      setErrorA11y(t('secureMessaging.attachments.fileSumSizeError.A11yLabel'))
    } else {
      setError('')
      callbackIfUri(document, false)
    }
  } catch (docError) {
    if (isErrorObject(docError)) {
      if (isCancel(docError)) {
        return
      }

      logNonFatalErrorToFirebase(docError, 'onFileFolderSelect: Secure Messaging Error')

      if (docError.code) {
        setError(docError.code)
      }
    }
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
  setErrorA11y: (errorA11y: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
  imageBase64s: Array<string>,
  t: TFunction,
): void => {
  const { assets, errorMessage, didCancel } = response
  const { fileSize, type, uri, base64 } = assets ? assets[0] : ({} as Asset)

  if (didCancel) {
    return
  }

  if (!!base64 && imageBase64s.indexOf(base64) !== -1) {
    setError(t('secureMessaging.attachments.duplicateFileError'))
  } else if (!!type && !isValidAttachmentsFileType(type)) {
    setError(t('secureMessaging.attachments.fileTypeError'))
  } else if (!!fileSize && fileSize > MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES) {
    setError(t('secureMessaging.attachments.fileSizeError'))
    setErrorA11y(t('secureMessaging.attachments.fileSizeError.A11yLabel'))
  } else if (!!fileSize && fileSize + totalBytesUsed > MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES) {
    setError(t('secureMessaging.attachments.fileSumSizeError'))
    setErrorA11y(t('secureMessaging.attachments.fileSumSizeError.A11yLabel'))
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
 * camera or camera roll or the device's folders). maxHeight and minHeight are set to 1375 (125 PPI),
 * which still provides a readable document even with small text size
 *
 * @param t - translation function
 * @param showActionSheetWithOptions - hook to open the action sheet
 * @param setError - sets error message
 * @param callbackIfUri - callback when a file is selected or taken with the camera successfully
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 * @param fileUris - list of already attached files uri values
 * @param imageBase64s - list of already attached images base64 values
 * @param setIsActionSheetVisible - Function for updating the state of the action sheet visibility. Useful for preventing back navigation when action sheet is opened
 */
export const onAddFileAttachments = (
  t: TFunction,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => void,
  setError: (error: string) => void,
  setErrorA11y: (errorA11y: string) => void,
  callbackIfUri: (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean) => void,
  totalBytesUsed: number,
  fileUris: Array<string>,
  imageBase64s: Array<string>,
  setIsActionSheetVisible: (isVisible: boolean) => void,
): void => {
  const options = [t('camera'), t('photoGallery'), t('fileFolder'), t('cancel')]

  setIsActionSheetVisible(true)
  showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: 3,
    },
    (buttonIndex) => {
      setIsActionSheetVisible(false)
      switch (buttonIndex) {
        case 0:
          launchCamera(
            { mediaType: 'photo', quality: 1, maxWidth: MAX_IMAGE_DIMENSION, maxHeight: MAX_IMAGE_DIMENSION, includeBase64: true },
            (response: ImagePickerResponse): void => {
              postCameraOrImageLaunchOnFileAttachments(response, setError, setErrorA11y, callbackIfUri, totalBytesUsed, imageBase64s, t)
            },
          )
          break
        case 1:
          launchImageLibrary(
            { mediaType: 'photo', quality: 1, maxWidth: MAX_IMAGE_DIMENSION, maxHeight: MAX_IMAGE_DIMENSION, includeBase64: true },
            (response: ImagePickerResponse): void => {
              postCameraOrImageLaunchOnFileAttachments(response, setError, setErrorA11y, callbackIfUri, totalBytesUsed, imageBase64s, t)
            },
          )
          break
        case 2:
          onFileFolderSelect(setError, setErrorA11y, callbackIfUri, totalBytesUsed, fileUris, t)
          break
      }
    },
  )
}

export const getfolderName = (id: string, folders: SecureMessagingFolderList): string => {
  const folderName = _.filter(folders, (folder) => {
    return folder.id === id
  })[0]?.attributes.name

  return folderName === FolderNameTypeConstants.deleted ? TRASH_FOLDER_NAME : folderName
}

/**
 * Checks if the message has attachments before saving a draft and displays a message to the
 * user letting them know that the attachments wouldn't be saved with the draft
 * @param alert - Alert from useDestructiveActionSheet() hook
 * @param attachmentsList - List of attachments
 * @param t - Traslation function
 * @param dispatchSaveDraft - Dispatch save draft callback
 */
export const saveDraftWithAttachmentAlert = (
  alert: (props: useDestructiveActionSheetProps) => void,
  attachmentsList: Array<imageDocumentResponseType>,
  t: TFunction,
  dispatchSaveDraft: () => void,
) => {
  if (attachmentsList.length) {
    alert({
      title: t('secureMessaging.draft.cantSaveAttachments'),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('keepEditing'),
        },
        {
          text: t('secureMessaging.saveDraft'),
          onPress: dispatchSaveDraft,
        },
      ],
    })
  } else {
    dispatchSaveDraft()
  }
}
