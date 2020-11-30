import { PhoneData } from 'store/api/types/PhoneData'
import { PixelRatio } from 'react-native'
import { formatPhoneNumber } from './formattingUtils'

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
 * Returns a function to calculate 'value' based on fontScale
 * @Deprecated - use the version from /utils/hooks instead
 */
export const useFontScale = (): Function => {
  return (value: number): number => {
    return PixelRatio.getFontScale() * value
  }
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
