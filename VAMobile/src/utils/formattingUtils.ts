import { BIOMETRY_TYPE } from 'react-native-keychain'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { TFunction } from 'i18next'

/**
 * Returns the formatted phone number
 *
 * @param phoneNumber - string signifying phone number w/ area code, i.e. 0001234567
 *
 * @returns string formatted for phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
}

/**
 * Returns the date formatted utilizing the luxon DateTime functionality
 *
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 * @param dateTimeType - type DateTimeFormatOptions, to describe the format of the resulting string i.e. DateTime.DATE_SHORT = mm/dd/yyy
 * @param timeZone - optional parameter to set the timezone if there is one given
 * @param dateTimeOptions - optional fields to additionally display onto the date
 *
 * @returns date string formatted based on formatBy
 */
export const getFormattedDateOrTimeWithFormatOption = (
  dateTime: string,
  dateTimeType: DateTimeFormatOptions,
  timeZone?: string,
  dateTimeOptions?: { [key: string]: string },
): string => {
  let dateObj = DateTime.fromISO(dateTime)
  if (timeZone) {
    dateObj = dateObj.setZone(timeZone)
  }

  return dateObj.toLocaleString(Object.assign(dateTimeType, dateTimeOptions))
}

/**
 * Returns the date formatted in the format DAY OF WEEK, MONTH DAY, YEAR
 *
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 * @param timeZone - string signifying the current timeZone i.e. America/Los_Angeles
 *
 * @returns the date formatted in the format DAY OF WEEK, MONTH DAY, YEAR
 */
export const getFormattedDateWithWeekdayForTimeZone = (dateTime: string, timeZone: string): string => {
  return getFormattedDateOrTimeWithFormatOption(dateTime, DateTime.DATE_FULL, timeZone, { weekday: 'long' })
}

/**
 *Returns the date formatted in the format DAY OF WEEK, MONTH DAY, YEAR
 *
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns the date string based on format specified below
 */
export const getFormattedDateTimeYear = (dateTime: string): string => {
  return DateTime.fromISO(dateTime).toFormat("dd MMM yyyy '@' HHmm ZZZZ")
}

/**
 * Returns the date formatted in the format HH:MM aa TIMEZONE
 *
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 * @param timeZone - string signifying the current timeZone i.e. America/Los_Angeles
 *
 * @returns  the date formatted in the format HH:MM aa TIMEZONE
 */
export const getFormattedTimeForTimeZone = (dateTime: string, timeZone?: string): string => {
  return getFormattedDateOrTimeWithFormatOption(dateTime, DateTime.TIME_SIMPLE, timeZone, { timeZoneName: 'short' })
}

/**
 * Returns the number of seconds UTC from 1970
 *
 * @param date - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns the number of seconds UTC from 1970
 */
export const getEpochSecondsOfDate = (date: string): number => {
  const newDate = new Date(date)
  return DateTime.utc(
    newDate.getUTCFullYear(),
    newDate.getUTCMonth() + 1,
    newDate.getUTCDate(),
    newDate.getUTCHours(),
    newDate.getUTCMinutes(),
    newDate.getUTCSeconds(),
    newDate.getUTCMilliseconds(),
  ).toSeconds()
}

/**
 * Returns the date formatted utilizing the formatBy parameter
 *
 * @param date - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 * @param formatBy - string signifying how the date should be formatted, i.e. MMMM dd, yyyy
 *
 * @returns date string formatted based on formatBy
 */
export const getFormattedDate = (date: string, formatBy: string): string => {
  if (date) {
    return DateTime.fromISO(date).toLocal().toFormat(formatBy)
  }

  return ''
}

/**
 * Returns the date formatted in the format MMMM dd, yyyy
 *
 * @param date - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns date string formatted as MMMM dd, yyyy
 */
export const formatDateMMMMDDYYYY = (date: string): string => {
  return getFormattedDate(date, 'MMMM dd, yyyy')
}

/**
 * Returns the word formatted so that the first letter is upper case and the rest is lowercase
 *
 * @param word - word to capitalize
 *
 * @returns word with capitalized first letter and rest of the word lowercased
 */
export const capitalizeWord = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Returns the string formatted so that the first letter is upper case and the rest is unchanged
 *
 * @param originalStr - string to format
 *
 * @returns string with capitalized first letter and rest of the string unchanged
 */
export const capitalizeFirstLetter = (originalStr: string): string => {
  return originalStr.charAt(0).toUpperCase() + originalStr.slice(1)
}

/**
 * Returns the string formatted in title case
 *
 * @param originalStr - string to format
 *
 * @returns string with the first letter after any spaces capitalized
 */
export const stringToTitleCase = (str: string) => {
	return str.toLowerCase()
    		.split(' ')
    		.map((s) => capitalizeFirstLetter(s))
    		.join(' ');
}

/**
 * Returns the given number as a string rounded to the hundredths place
 *
 * @param number - number to round
 *
 * @returns string of number rounded to the hundredths place
 */
export const roundToHundredthsPlace = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

/**
 * Returns original string split by spaces to create individual words from camel case input
 *
 * @param originalStr - camel case string to split into words
 *
 * @returns original string split by spaces
 */
export const camelToIndividualWords = (originalStr: string): string => {
  return originalStr.replace(/([A-Z])/g, ' $1')
}

/**s
 * Returns a luxon DateTime object from an ISO 8601 string
 *
 * @param dateStr - string to build the date from
 *
 * @returns the DateTime representation of the string
 */
export const getDateFromString = (dateStr: string): DateTime => {
  return DateTime.fromISO(dateStr)
}

/** Gets the numbers from the given text and returns the text of only numbers
 *
 * @param text - string to extract numbers from
 *
 * @returns the text of only numbers
 */
export const getNumbersFromString = (text: string): string => {
  return text.replace(/\D/g, '')
}

/** Gets the numbers from the given text and returns its accessibilityLabel
 *
 * @param text - string to extract numbers from
 *
 * @returns the text of only numbers with spaces in between
 */
export const getNumberAccessibilityLabelFromString = (text: string): string => {
  return getNumbersFromString(text).split('').join(' ')
}

/**
 * Correlate the string received from the biometrics library to an i18n friendly tag used for various labels
 * @param supportedBiometric - string to translate
 */
export const getSupportedBiometricTranslationTag = (supportedBiometric: string): string => {
  switch (supportedBiometric) {
    case BIOMETRY_TYPE.FACE_ID:
      return 'faceID'
    case BIOMETRY_TYPE.TOUCH_ID:
      return 'touchID'
    case BIOMETRY_TYPE.FACE:
      return 'faceRecognition'
    case BIOMETRY_TYPE.FINGERPRINT:
      return 'fingerPrint'
    case BIOMETRY_TYPE.IRIS:
      return 'iris'
    default:
      return ''
  }
}

/**
 * Formats the string received from the keychain getSupportedBiometryType call into user facing text
 * @param supportedBiometric - supported biometric as determined by keychain
 * @param t - translation function
 */
export const getSupportedBiometricText = (supportedBiometric: string, t: TFunction): string => {
  const translationTag = getSupportedBiometricTranslationTag(supportedBiometric)
  return t(`settings:biometric.${translationTag}`)
}

/**
 * Makes the string received from the keychain getSupportedBiometryType call screen reader compatible
 * @param supportedBiometric - supported biometric as determined by keychain
 * @param t - translation function
 */
export const getSupportedBiometricA11yLabel = (supportedBiometric: string, t: TFunction): string => {
  switch (supportedBiometric) {
    case BIOMETRY_TYPE.FACE_ID:
      return t('settings:biometric.faceID.a11yLabel')
    case BIOMETRY_TYPE.TOUCH_ID:
      return t('settings:biometric.touchID.a11yLabel')
    case BIOMETRY_TYPE.FACE:
      return t('settings:biometric.faceRecognition')
    case BIOMETRY_TYPE.FINGERPRINT:
      return t('settings:biometric.fingerPrint')
    case BIOMETRY_TYPE.IRIS:
      return t('settings:biometric.iris')
    default:
      return ''
  }
}
