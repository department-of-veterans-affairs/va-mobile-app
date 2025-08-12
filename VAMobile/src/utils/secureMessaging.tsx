import React, { ReactNode } from 'react'
import { Dimensions } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'
import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { TFunction } from 'i18next'
import _ from 'underscore'

import {
  CategoryTypeFields,
  CategoryTypes,
  Facility,
  SecureMessagingFolderList,
  SecureMessagingMessageList,
} from 'api/types'
import { Box, InlineTextWithIconsProps, LinkWithAnalytics, MessageListItemObj, PickerItem, TextView } from 'components'
import Unread from 'components/VAIcon/svgs/Unread.svg'
import { Events } from 'constants/analytics'
import { EMAIL_REGEX_EXP, MAIL_TO_REGEX_EXP, PHONE_REGEX_EXP, URL2_REGEX_EXP, URL_REGEX_EXP } from 'constants/common'
import {
  FolderNameTypeConstants,
  MAX_IMAGE_DIMENSION,
  MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES,
  MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES,
  READ,
  TRASH_FOLDER_NAME,
} from 'constants/secureMessaging'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import theme from 'styles/themes/standardTheme'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { generateTestIDForInlineTextIconList, isErrorObject } from 'utils/common'
import {
  getFormattedMessageTime,
  getNumberAccessibilityLabelFromString,
  getNumbersFromString,
  stringToTitleCase,
} from 'utils/formattingUtils'
import { ActionSheetProps, imageDocumentResponseType } from 'utils/hooks'

const MAX_SUBJECT_LENGTH = 50

export type RecentRecipient = {
  label: string
  value?: string
  date: string
}

/**
 * Returns recent recipients based on the SecureMessagingMessageList data
 * Modeled after this branch from sm team: https://github.com/department-of-veterans-affairs/va-mobile-app/pull/10896/files
 * might want to move this to the backend
 *
 * @param data - SecureMessagingMessageList data
 */
export const getRecentRecipients = (data: SecureMessagingMessageList) => {
  const recentList: Record<string, RecentRecipient> = {}
  _.each(data, (sentMessage) => {
    const currentRecipientId = sentMessage?.attributes?.recipientId
    const recentRecipient: RecentRecipient = {
      label: sentMessage?.attributes?.recipientName,
      value: String(sentMessage?.attributes?.recipientId),
      date: sentMessage?.attributes?.sentDate,
    }
    if (currentRecipientId) {
      if (!recentList[currentRecipientId]) {
        recentList[currentRecipientId] = recentRecipient
      } else {
        if (new Date(recentRecipient.date) > new Date(recentList[currentRecipientId].date)) {
          recentList[currentRecipientId] = recentRecipient
        }
      }
    }
  })

  return _.values(recentList)
}

export const getMessagesListItems = (
  messages: SecureMessagingMessageList,
  t: TFunction,
  onMessagePress: (messageID: number, isDraft?: boolean, unreadMessage?: boolean) => void,
  folderName?: string,
): Array<MessageListItemObj> => {
  return messages.map((message, index) => {
    const { attributes } = message
    const { attachment, recipientName, senderName, subject, sentDate, readReceipt, hasAttachments, category } =
      attributes
    const isSentFolder = folderName === FolderNameTypeConstants.sent
    const isDraftsFolder = folderName === FolderNameTypeConstants.drafts
    const isOutbound = isSentFolder || isDraftsFolder
    const attachFileIconColor =
      theme.mode === 'dark' ? colors.vadsColorFormsBorderDefaultOnDark : colors.vadsColorFormsBorderDefaultOnLight
    const unreadIconProps =
      readReceipt !== READ && !isOutbound
        ? ({ svg: Unread, height: 16, width: 16, testID: 'Unread' } as IconProps)
        : undefined
    const paperClipProps =
      hasAttachments || attachment
        ? ({
            name: 'AttachFile',
            width: 21,
            height: 21,
            fill: attachFileIconColor,
            testID: 'AttachFile',
          } as IconProps)
        : undefined

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
      },
      {
        leftTextProps: {
          text: t('text.raw', { text: getFormattedMessageTime(sentDate) }),
          variant: 'MobileBody',
          textAlign: 'left',
        },
      },
      {
        leftTextProps: {
          text: t('text.raw', { text: formatSubject(category, subject, t) }),
          variant: 'MobileBody',
          textAlign: 'left',
        },
        leftIconProps: paperClipProps,
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
        logAnalyticsEvent(
          Events.vama_sm_open(message.id, folder(), readReceipt !== READ && !isOutbound ? 'unread' : 'read'),
        )
        onMessagePress(message.id, isDraftsFolder, readReceipt !== READ)
      },
      a11yHintText: isDraftsFolder
        ? t('secureMessaging.viewMessage.draft.a11yHint')
        : t('secureMessaging.viewMessage.a11yHint'),
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
 * @param setIsActionSheetVisible - Function for updating the state of the action sheet visibility.
 * Useful for preventing back navigation when action sheet is opened
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
            {
              mediaType: 'photo',
              quality: 1,
              maxWidth: MAX_IMAGE_DIMENSION,
              maxHeight: MAX_IMAGE_DIMENSION,
              presentationStyle: 'fullScreen',
              includeBase64: true,
            },
            (response: ImagePickerResponse): void => {
              postCameraOrImageLaunchOnFileAttachments(
                response,
                setError,
                setErrorA11y,
                callbackIfUri,
                totalBytesUsed,
                imageBase64s,
                t,
              )
            },
          )
          break
        case 1:
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 1,
              maxWidth: MAX_IMAGE_DIMENSION,
              maxHeight: MAX_IMAGE_DIMENSION,
              includeBase64: true,
            },
            (response: ImagePickerResponse): void => {
              postCameraOrImageLaunchOnFileAttachments(
                response,
                setError,
                setErrorA11y,
                callbackIfUri,
                totalBytesUsed,
                imageBase64s,
                t,
              )
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
 * @param alert - Alert from useShowActionSheet() hook
 * @param attachmentsList - List of attachments
 * @param t - Translation function
 * @param dispatchSaveDraft - Dispatch save draft callback
 */
export const saveDraftWithAttachmentAlert = (
  alert: (options: ActionSheetProps, callback: (i?: number) => void | Promise<void>) => void,
  attachmentsList: Array<imageDocumentResponseType>,
  t: TFunction,
  dispatchSaveDraft: () => void,
) => {
  if (attachmentsList.length) {
    const options = [t('secureMessaging.saveDraft'), t('keepEditing')]
    alert(
      {
        options,
        title: t('secureMessaging.draft.cantSaveAttachments'),
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            dispatchSaveDraft()
            break
        }
      },
    )
  } else {
    dispatchSaveDraft()
  }
}

export const getLinkifiedText = (body: string, t: TFunction, isPortrait: boolean): ReactNode => {
  const textReconstructedBody: Array<ReactNode> = []
  const bodySplit = body.split(/\s/).filter((value) => value !== '')
  const whiteSpace = body
    .trim()
    .split(/\S/)
    .reverse()
    .filter((value) => value !== '')
  let dontAddNextString = false
  let savedText = ''
  _.forEach(bodySplit, (text, index) => {
    if (dontAddNextString) {
      //if previous entry was a phone number with xxx xxx xxxx format need to not add xxxx again
      dontAddNextString = false
      return
    }
    let nonWhiteSpaceCheck = savedText.split(/\s/).filter((value) => value !== '').length > 0
    if (index !== 0 && index !== bodySplit.length - 1) {
      //phone number with spaces xxx xxx xxxx format
      const previousText = bodySplit[index - 1]
      const nextText = bodySplit[index + 1]
      const testString = previousText + ' ' + text + ' ' + nextText
      const phoneMatch = PHONE_REGEX_EXP.exec(testString)
      if (phoneMatch) {
        if (savedText.length > 3) {
          savedText = savedText.slice(0, savedText.length - 4)
        }
        nonWhiteSpaceCheck = savedText.split(/\s/).filter((value) => value !== '').length > 0
        textReconstructedBody.push(
          <TextView accessible={nonWhiteSpaceCheck} selectable={nonWhiteSpaceCheck} variant="MobileBody">
            {savedText}
          </TextView>,
        )
        savedText = ''
        textReconstructedBody.push(
          <LinkWithAnalytics
            type="call"
            phoneNumber={previousText + text + nextText}
            text={previousText + ' ' + text + ' ' + nextText}
            icon="no icon"
            disablePadding={true}
            a11yLabel={getNumberAccessibilityLabelFromString(previousText + text + nextText)}
            a11yHint={t('openInPhoneMessaging.a11yHint')}
          />,
        )
        savedText += whiteSpace.pop() || ''
        dontAddNextString = true
        return
      }
    }

    const emailMatch = EMAIL_REGEX_EXP.exec(text)
    const mailToMatch = MAIL_TO_REGEX_EXP.exec(text)
    const phoneMatch = PHONE_REGEX_EXP.exec(text)
    const urlMatch = URL_REGEX_EXP.exec(text)
    const url2Match = URL2_REGEX_EXP.exec(text)
    if (emailMatch) {
      //matches <email address> only
      textReconstructedBody.push(
        <TextView accessible={nonWhiteSpaceCheck} selectable={nonWhiteSpaceCheck} variant="MobileBody">
          {savedText}
        </TextView>,
      )
      savedText = ''
      textReconstructedBody.push(
        <LinkWithAnalytics
          type="url"
          url={'mailto:' + text}
          text={text}
          icon="no icon"
          disablePadding={true}
          a11yLabel={text}
          a11yHint={t('openInEmailMessaging.a11yHint')}
        />,
      )
      savedText += whiteSpace.pop() || ''
    } else if (mailToMatch) {
      // matches mailto:<email address>
      textReconstructedBody.push(
        <TextView accessible={nonWhiteSpaceCheck} selectable={nonWhiteSpaceCheck} variant="MobileBody">
          {savedText}
        </TextView>,
      )
      savedText = ''
      textReconstructedBody.push(
        <LinkWithAnalytics
          type="url"
          url={text}
          text={text}
          icon="no icon"
          disablePadding={true}
          a11yLabel={text}
          a11yHint={t('openInEmailMessaging.a11yHint')}
        />,
      )
      savedText += whiteSpace.pop() || ''
    } else if (phoneMatch) {
      // matches 8006982411 800-698-2411 1-800-698-2411 (800)698-2411 (800)-698-2411 +8006982411 +18006982411
      textReconstructedBody.push(
        <TextView accessible={nonWhiteSpaceCheck} selectable={nonWhiteSpaceCheck} variant="MobileBody">
          {savedText}
        </TextView>,
      )
      savedText = ''
      textReconstructedBody.push(
        <LinkWithAnalytics
          type="call"
          phoneNumber={getNumbersFromString(text)}
          text={text}
          icon="no icon"
          disablePadding={true}
          a11yLabel={getNumberAccessibilityLabelFromString(getNumbersFromString(text))}
          a11yHint={t('openInPhoneMessaging.a11yHint')}
        />,
      )
      savedText += whiteSpace.pop() || ''
    } else if (urlMatch) {
      // matches any https, http url
      textReconstructedBody.push(
        <TextView accessible={nonWhiteSpaceCheck} selectable={nonWhiteSpaceCheck} variant="MobileBody">
          {savedText}
        </TextView>,
      )
      savedText = ''
      textReconstructedBody.push(
        <Box minWidth={isPortrait ? Dimensions.get('window').width : Dimensions.get('window').height}>
          <LinkWithAnalytics
            type="url"
            url={text}
            text={text}
            icon="no icon"
            disablePadding={true}
            a11yLabel={text}
            a11yHint={t('openInBrowser.a11yHint')}
          />
        </Box>,
      )
      savedText += whiteSpace.pop() || ''
    } else if (url2Match) {
      // matches links like www.gooog.com or google.com (limit is 2 or 3 characters after the . to turn it
      // into a link - may need to update this if we need to include other domains greater than 3 digits)
      textReconstructedBody.push(
        <TextView accessible={nonWhiteSpaceCheck} selectable={nonWhiteSpaceCheck} variant="MobileBody">
          {savedText}
        </TextView>,
      )
      savedText = ''
      textReconstructedBody.push(
        <LinkWithAnalytics
          type="url"
          url={'https://' + text}
          text={text}
          icon="no icon"
          disablePadding={true}
          a11yLabel={text}
          a11yHint={t('openInBrowser.a11yHint')}
        />,
      )
      savedText += whiteSpace.pop() || ''
    } else {
      const spacing = whiteSpace.pop() || ''
      savedText += text + spacing
    }
  })

  if (savedText.length > 0 && savedText.split(/\s/).filter((value) => value !== '').length > 0) {
    //prohibits whitespace only being added to the end after a link
    textReconstructedBody.push(
      <TextView selectable={true} variant="MobileBody">
        {savedText}
      </TextView>,
    )
  }

  return (
    <Box mb={theme.paragraphSpacing.spacing20FontSize} flexDirection="row" flexWrap="wrap">
      {textReconstructedBody}
    </Box>
  )
}

export const getCareSystemPickerOptions = (facilitiesInfo: Array<Facility>): Array<PickerItem> => {
  return facilitiesInfo.map((facility) => {
    return {
      label: facility.name,
      value: facility.id,
    }
  })
}
