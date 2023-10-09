import { Animated, Dimensions, TextInput } from 'react-native'
import { Asset } from 'react-native-image-picker'
import { DateTime } from 'luxon'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { RefObject } from 'react'
import { contains, isEmpty, map } from 'underscore'

import { AppDispatch } from 'store'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ErrorObject } from 'store/api'
import { Events } from 'constants/analytics'
import { InlineTextWithIconsProps } from 'components/InlineTextWithIcons'
import { PhoneData } from 'api/types/PhoneData'
import { StackCardInterpolatedStyle, StackCardInterpolationProps } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { TextLine } from 'components/types'
import { TextLineWithIconProps } from 'components'
import { formatPhoneNumber } from './formattingUtils'
import { logAnalyticsEvent } from './analytics'
import { updatBottomOffset } from 'store/slices/snackBarSlice'
import theme from 'styles/themes/standardTheme'

/**
 * Generates testID string for reusable components
 */
export const generateTestID = (value: string, suffix: string): string => {
  // ex. value: 'My title', suffix: 'wide-button' -> 'my-title-wide-button'
  const updatedValue = value.toLowerCase().replace(/\s/g, '-')

  if (suffix !== '') {
    return updatedValue + '-' + suffix
  }

  return updatedValue
}

/**
 * Generate a testID string for the array of text lines passed into TextLines for list item
 */
export const generateTestIDForTextList = (listOfText?: Array<TextLine>): string => {
  const listOfTextID: Array<string> = []

  if (!listOfText) {
    return ''
  }

  listOfText.forEach((listOfTextItem: TextLine) => {
    listOfTextID.push(listOfTextItem.text)
  })

  return generateTestID(listOfTextID.join(' '), '')
}

/**
 * Generate a testID string for the array of text lines passed into TextLineWithIcon for list item - includes accessibility labels for icons
 */
export const generateTestIDForInlineTextIconList = (listOfText: Array<InlineTextWithIconsProps>, t: TFunction): string => {
  const listOfTextID: Array<string> = []

  listOfText.forEach((listOfTextItem: InlineTextWithIconsProps) => {
    if (listOfTextItem.leftIconProps && listOfTextItem.leftIconProps.name === 'Unread') {
      listOfTextID.push(t('secureMessaging.unread.a11y'))
    }
    if (listOfTextItem.leftIconProps && listOfTextItem.leftIconProps.name === 'PaperClip') {
      listOfTextID.push(t('secureMessaging.attachments.hasAttachment'))
    }
    listOfTextID.push(listOfTextItem.leftTextProps.text)

    if (listOfTextItem.rightTextProps?.text) {
      listOfTextID.push(listOfTextItem.rightTextProps.text)
    }
  })

  return listOfTextID.join(' ')
}

/**
 * Generate a testID string for the array of text lines passed into TextLineWithIcon for list item - includes accessibility labels for icons
 */
export const generateTestIDForTextIconList = (listOfText: Array<TextLineWithIconProps>, t: TFunction): string => {
  const listOfTextID: Array<string> = []

  listOfText.forEach((listOfTextItem: TextLineWithIconProps) => {
    if (listOfTextItem.iconProps && listOfTextItem.iconProps.name === 'Unread') {
      listOfTextID.push(t('secureMessaging.unread.a11y'))
    }
    if (listOfTextItem.iconProps && listOfTextItem.iconProps.name === 'PaperClip') {
      listOfTextID.push(t('secureMessaging.attachments.hasAttachment'))
    }
    listOfTextID.push(listOfTextItem.text)
  })

  return listOfTextID.join(' ')
}

/**
 * Returns the formatted phone number given the PhoneData object
 */
export const getFormattedPhoneNumber = (phoneData: PhoneData): string => {
  if (phoneData && phoneData.areaCode && phoneData.phoneNumber) {
    return formatPhoneNumber(`${phoneData.areaCode}${phoneData.phoneNumber}`)
  }

  return ''
}

/**
 * Returns an updated list of fields that only contains the values that exist (are not empty strings or undefined)
 *
 * @param fieldsList - array of strings to be filtered
 *
 * @returns array of strings in which all values exist
 */
export const getAllFieldsThatExist = (fieldsList: Array<string>): Array<string> => {
  return fieldsList.filter(Boolean)
}

/**
 * Sets the focus on the given text input ref
 *
 * @param inputRef - ref for text input
 */
export const focusTextInputRef = (inputRef: RefObject<TextInput>): void => {
  return inputRef?.current?.focus()
}

/**
 * Sorts the list of data in descending or ascending order based on date
 *
 * @param dataList - list of data to be sorted
 * @param dateField - field name of the date
 * @param isDescending - optional param that if true sorts the list by date from most recent to least recent
 */
export const sortByDate = (dataList: Array<{ [key: string]: string }>, dateField: string, isDescending?: boolean): void => {
  dataList.sort((a, b) => {
    const aDateField = a[dateField]
    const bDateField = b[dateField]

    return compareDateStrings(aDateField, bDateField, isDescending)
  })
}

/**
 * Compare function to use on dates represented as string. Can be used by sort functions
 * @param a - first date to compare
 * @param b - second date to compare
 * @param isDescending - optional param for whether to favor most recent
 */
export const compareDateStrings = (a: string, b: string, isDescending?: boolean): number => {
  const infiniteNum = isDescending ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY

  const d1 = a && a !== '' ? DateTime.fromISO(a).toMillis() : infiniteNum
  const d2 = b && b !== '' ? DateTime.fromISO(b).toMillis() : infiniteNum
  return isDescending ? d2 - d1 : d1 - d2
}

const invalidStrings = ['not_found', 'undefined', 'null']
/**
 * Takes in a string value and either returns the original value or empty string if its null, undefined, or 'NOT_FOUND'
 * @param val - value to sanitize
 */
export const sanitizeString = (val: string): string => {
  return !!val && !contains(invalidStrings, val.toLowerCase()) ? val : ''
}

/**
 * Converts the given bytes to a size display string that includes the size unit and parentheses. Rounded to two decimals
 * Example: '(12 MB)'
 *
 * @param bytes - given number to convert mb, kb, or bytes representation
 * @param t - translation function
 * @param includeParens - whether to display parenthesis around the size. Defaults to true
 */
export const bytesToFinalSizeDisplay = (bytes: number, t: TFunction, includeParens = true): string => {
  let fileSize = ''

  if (bytes < 10) {
    // Less than 0.01 KB, display with Bytes size unit
    fileSize = `${bytes} ${t('Bytes')}`
  } else if (bytes < 10000) {
    // Less than 0.01 MB, display with KB size unit
    const kb = bytesToKilobytes(bytes)
    fileSize = `${kb} ${t('KB')}`
  } else {
    const mb = bytesToMegabytes(bytes)
    fileSize = `${mb} ${t('MB')}`
  }

  return includeParens ? `(${fileSize})` : fileSize
}

/**
 * Converts the given bytes to a size display string that includes the size unit and parentheses. Rounded to two decimals
 * Example: '(12 MB)'
 * Strings returned use the accessibility labels for screenreaders
 *
 * @param bytes - given number to convert mb, kb, or bytes representation
 * @param t - translation function
 * @param includeParens - whether to display parenthesis around the size. Defaults to true
 */
export const bytesToFinalSizeDisplayA11y = (bytes: number, t: TFunction, includeParens = true): string => {
  let fileSize = ''

  if (bytes < 10) {
    // Less than 0.01 KB, display with Bytes size unit
    fileSize = `${bytes} ${t('Bytes')}`
  } else if (bytes < 10000) {
    // Less than 0.01 MB, display with KB size unit
    const kb = bytesToKilobytes(bytes)
    fileSize = `${kb} ${t('KB.a11y')}`
  } else {
    const mb = bytesToMegabytes(bytes)
    fileSize = `${mb} ${t('MB.a11y')}`
  }

  return includeParens ? `(${fileSize})` : fileSize
}

/**
 * Converts the given bytes to kb, rounded to two decimals
 *
 * @param bytes - given number to convert to kb
 */
export const bytesToKilobytes = (bytes: number): number => {
  const kb = bytes / 1024
  return Math.round((kb + Number.EPSILON) * 100) / 100
}

/**
 * Converts the given bytes to mb, rounded to two decimals
 *
 * @param bytes - given number to convert to mb
 */
export const bytesToMegabytes = (bytes: number): number => {
  const mb = bytes / (1024 * 1024)
  return Math.round((mb + Number.EPSILON) * 100) / 100
}

export type ImageMaxWidthAndHeight = {
  maxWidth: string
  height: number
}

/**
 * Returns the maxWidth and height for an image, assuming the image can fill the width of the screen and the
 * max height is specified
 *
 * @param image - object with image data
 * @param messagePhotoAttachmentMaxHeight - max height for an image
 */
export const getMaxWidthAndHeightOfImage = (image: ImagePickerResponse, messagePhotoAttachmentMaxHeight: number): ImageMaxWidthAndHeight => {
  const result: ImageMaxWidthAndHeight = { maxWidth: '100%', height: messagePhotoAttachmentMaxHeight }
  const { width, height } = image.assets ? image.assets[0] : ({} as Asset)
  if (image && !isEmpty(image)) {
    if (width && width < Dimensions.get('window').width) {
      result.maxWidth = `${width}px`
    }

    if (height && height < messagePhotoAttachmentMaxHeight) {
      result.height = height
    }
  }

  return result
}

/**
 * Returns a slice if the requested page and pageSize is within the range; otherwise undefined. Used for
 * pagination to load previously loaded items.
 *
 * @param items - items to pull from if within range
 * @param requestedPage - the page that is being requested
 * @param pageSize - the size of the page
 */
export const getItemsInRange = <T>(items: Array<T>, requestedPage: number, pageSize: number): Array<T> | undefined => {
  // get begin and end index to check if we have the items already and for slicing
  const beginIdx = (requestedPage - 1) * pageSize
  const endIdx = requestedPage * pageSize

  if (beginIdx < items.length) {
    return items.slice(beginIdx, endIdx)
  }
}

/**
 * Returns type Predicate for the type guard
 *
 * @param error - error object coming from exception in catch
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorObject = (error: any): error is ErrorObject => {
  return ['json', 'stack', 'networkError'].some((item) => item in error)
}

export const deepCopyObject = <T>(item: Record<string, unknown>): T => {
  if (item) {
    return JSON.parse(JSON.stringify(item))
  }

  return item as T
}

/**
 * Function to show snackbar
 * @param message - snackbar message
 * @param dispatch - dispatch function to change the bottom offset
 * @param actionPressed - action to perform on undo
 * @param isUndo - if user pressed undo it will not show undo again
 * @param isError - if it is an error will show the error icon
 * @param withNavBar - offset snackbar to be over the bottom nav
 * @returns snackbar
 */
export function showSnackBar(message: string, dispatch: AppDispatch, actionPressed?: () => void, isUndo?: boolean, isError?: boolean, withNavBar = false): void {
  if (!snackBar) {
    logAnalyticsEvent(Events.vama_snackbar_null('showSnackBar'))
  }
  snackBar?.hideAll()
  dispatch(updatBottomOffset(withNavBar ? theme.dimensions.snackBarBottomOffsetWithNav : theme.dimensions.snackBarBottomOffset))
  snackBar?.show(message, {
    type: 'custom_snackbar',
    data: {
      onActionPressed: () => {
        if (actionPressed) {
          actionPressed()
        }
      },
      isUndo,
      isError,
    },
  })
}

/**
 * Returns a string of the textlines concatenated
 *
 * @param itemTexts - array of textline to concatenate
 */

export const getA11yLabelText = (itemTexts: Array<TextLine>): string => {
  return map(itemTexts, 'text').join(' ')
}

/**
 * Provides a name and size as strings for either an image picker or document picker file
 * @param attachment - response from the image or document picker
 * @param t - translation function
 * @param fileSizeParens - whether to include parenthesis around the file size
 */
export const getFileDisplay = (
  attachment: ImagePickerResponse | DocumentPickerResponse,
  t: TFunction,
  fileSizeParens: boolean,
): { fileName: string; fileSize: string; fileSizeA11y: string } => {
  let fileName: string | undefined
  let fileSize: number | undefined

  if ('assets' in attachment) {
    const { fileName: name, fileSize: size } = attachment.assets ? attachment.assets[0] : ({} as Asset)
    fileName = name || ''
    fileSize = size || 0
  } else if ('size' in attachment) {
    const { name, size } = attachment
    fileName = name || ''
    fileSize = size || 0
  }

  const formattedFileSize = fileSize ? bytesToFinalSizeDisplay(fileSize, t, fileSizeParens) : ''

  const formattedFileSizeA11y = fileSize ? bytesToFinalSizeDisplayA11y(fileSize, t, fileSizeParens) : ''

  return { fileName: fileName || '', fileSize: formattedFileSize, fileSizeA11y: formattedFileSizeA11y }
}

// TODO #3959 ticket to remove HalfPanel
// function to animate a full screen panel into half the size
export function halfPanelCardStyleInterpolator({ current, inverted }: StackCardInterpolationProps): StackCardInterpolatedStyle {
  // height of the visible application window
  const windowHeight = Dimensions.get('window').height

  const translateY = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [windowHeight, windowHeight / 2], // modify constant for size of panel
      extrapolate: 'clamp',
    }),
    inverted,
  )
  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0.3, 1, 1],
  })
  return {
    cardStyle: {
      transform: [{ translateY }],
      maxHeight: Dimensions.get('window').height / 2,
    },
    overlayStyle: { opacity: overlayOpacity },
  }
}

export function fullPanelCardStyleInterpolator({ current, inverted, layouts }: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const screenHeight = layouts.screen.height

  const translateY = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight, screenHeight / 7], // modify constant for size of panel, higher the number more of the screen it covers
      extrapolate: 'clamp',
    }),
    inverted,
  )
  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0.3, 0.3, 0.3],
  })
  return {
    cardStyle: {
      transform: [{ translateY }],
      maxHeight: (screenHeight / 7) * 6, //must fill the remaining screen with modal(since top part was 1/7 this part is 6/7)
    },
    overlayStyle: { opacity: overlayOpacity },
  }
}
