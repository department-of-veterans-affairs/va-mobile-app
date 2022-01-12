import { Asset } from 'react-native-image-picker'
import { DateTime } from 'luxon'
import { Dimensions, TextInput } from 'react-native'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { RefObject } from 'react'
import { contains, isEmpty, map } from 'underscore'

import { AppDispatch } from 'store'
import { ErrorObject } from 'store/api'
import { PhoneData } from 'store/api/types/PhoneData'
import { TFunction } from 'i18next'
import { TextLine } from 'components/types'
import { TextLineWithIconProps } from 'components'
import { formatPhoneNumber } from './formattingUtils'
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
export const generateTestIDForTextIconList = (listOfText: Array<TextLineWithIconProps>, t: TFunction): string => {
  const listOfTextID: Array<string> = []

  listOfText.forEach((listOfTextItem: TextLineWithIconProps) => {
    if (listOfTextItem.iconProps && listOfTextItem.iconProps.name === 'UnreadIcon') {
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
 */
export const bytesToFinalSizeDisplay = (bytes: number, t: TFunction): string => {
  if (bytes < 10) {
    // Less than 0.01 KB, display with Bytes size unit
    return `(${bytes} ${t('common:Bytes')})`
  } else if (bytes < 10000) {
    // Less than 0.01 MB, display with KB size unit
    const kb = bytesToKilobytes(bytes)
    return `(${kb} ${t('common:KB')})`
  } else {
    const mb = bytesToMegabytes(bytes)
    return `(${mb} ${t('common:MB')})`
  }
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const isErrorObject = (error: any): error is ErrorObject => {
  return ['json', 'stack', 'networkError'].some((item) => item in error)
}

export const deepCopyObject = <T>(item: Record<string, unknown>): T => {
  if (item) {
    return JSON.parse(JSON.stringify(item))
  }

  return item
}

/**
 * Function to show snackbar
 * @param message - snackbar message
 * @param dispatch - dispatch function to change the bottom offset
 * @param actionPressed - action to perform on undo
 * @param isUndo - if user pressed undo it will not show undo again
 * @param isError - if it is an error will show the error icon
 * @param withNav - offset snackbar to be over the bottom nav
 * @returns snackbar
 */
export function showSnackBar(message: string, dispatch: AppDispatch, actionPressed?: () => void, isUndo?: boolean, isError?: boolean, withNavBar = false): void {
  dispatch(updatBottomOffset(withNavBar ? theme.dimensions.snackBarBottomOffsetWithNav : theme.dimensions.snackBarBottomOffset))
  snackBar.show(message, {
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
