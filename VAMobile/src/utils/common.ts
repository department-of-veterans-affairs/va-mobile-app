import { PixelRatio } from 'react-native'

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
 * Returns the formatted phone number given the area code and phone number
 */
export const getFormattedPhoneNumber = (areaCode: string, phoneNumber: string): string => {
  return `(${areaCode})-${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3)}`
}
