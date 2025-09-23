import { BIOMETRY_TYPE } from 'react-native-keychain'

import { TFunction } from 'i18next'
import { $Dictionary } from 'i18next/typescript/helpers'
import { DateTime, DateTimeFormatOptions } from 'luxon'

import { GMTPrefix, GMTTimezones } from 'constants/gmtTimezones'

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
 *Returns the date formatted in the format MONTH DAY, YEAR, TIME MERIDIEM TIMEZONE
 *
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns the date string based on format specified below
 */
export const getFormattedDateTimeYear = (dateTime: string): string => {
  return DateTime.fromISO(dateTime).toFormat('FF')
}

/**
 *Returns the date formatted in the format TIME if today and DATE if earlier
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns the date string based on format specified below
 */
export const getFormattedMessageTime = (dateTime: string): string => {
  const date = DateTime.fromISO(dateTime)
  if (DateTime.now().day === date.day && DateTime.now().month === date.month && DateTime.now().year === date.year) {
    return date.toFormat('t')
  } else {
    return date.toFormat('DDD')
  }
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
  let formattedTime = getFormattedDateOrTimeWithFormatOption(dateTime, DateTime.TIME_SIMPLE, timeZone, {
    timeZoneName: 'short',
  })

  // Specific non-location timezones are currently unavailable in DateTime
  // and formatting will fall back to GMT timezones (e.g. GMT+8).
  // This is a workaround to replace them with more user friendly timezone abbreviations.
  if (formattedTime.includes(GMTPrefix)) {
    for (const { pattern, value } of GMTTimezones.values()) {
      formattedTime = formattedTime.replace(pattern, value)
    }
  }

  return formattedTime
}

/**
 * Returns the datetime formatted in the format: Month DD, YYYY, HH:MM PM TIMEZONE
 *
 * @param dateTime - Full ISO 8601 datetime, i.e. 2013-06-06T04:00:00.000+00:00
 * @param timeZone - Optional override string for the current timeZone i.e. America/Los_Angeles
 *
 * @returns Returns datetime as: Month DD, YYYY, HH:MM PM TIMEZONE
 */
export const getFormattedDateAndTimeZone = (dateTime: string, timeZone?: string): string => {
  return getFormattedDateOrTimeWithFormatOption(dateTime, DateTime.DATETIME_MED, timeZone, {
    month: 'long',
    timeZoneName: 'short',
  })
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
export const getFormattedDate = (date: string | null, formatBy: string): string => {
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
 * Returns the date formatted in the format MM/DD/YYYY
 *
 * @param date - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns date string formatted as MM/DD/YYYY
 */
export const formatDateMMDDYYYY = (date: string): string => {
  return getFormattedDate(date, 'MM/dd/yyyy')
}

/**
 * Method that will format date for all time zones. Prevents the date being the day before on some time zones.
 *
 * @param date - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 * @param formatString - string signifying how the date should be formatted, i.e. MMMM dd, yyyy
 *
 * @returns  date string formatted based on formatString
 */
export const formatDateUtc = (date: string, formatString: string): string => {
  if (!date) {
    return ''
  }

  return DateTime.fromISO(date).toUTC().toFormat(formatString)
}

/**
 * Returns the substring of all entries before the provided character
 *
 * @param originalStr - string to be formatted
 * @param stopChar - character to stop at
 *
 * @returns string of all characters before the provided character
 */
export const getSubstringBeforeChar = (originalStr: string, stopChar: string): string => {
  return originalStr.substring(0, originalStr.indexOf(stopChar))
}

/**
 * Returns the word formatted so that the first letter is upper case and the rest is lowercase
 *
 * @param word - word to capitalize
 *
 * @returns word with capitalized first letter and rest of the word lowercased
 */
export const capitalizeWord = (word: string): string => {
  return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''
}

/**
 * Returns the string formatted so that the first letter is upper case and the rest is unchanged
 *
 * @param originalStr - string to format
 *
 * @returns string with capitalized first letter and rest of the string unchanged
 */
export const capitalizeFirstLetter = (originalStr: string): string => {
  if (!originalStr) {
    return ''
  }

  return originalStr.charAt(0).toUpperCase() + originalStr.slice(1)
}

/**
 * Returns the string formatted in title case
 *
 * @param str - string to format
 *
 * @returns string with the first letter after any spaces capitalized
 */
export const stringToTitleCase = (str: string): string => {
  if (!str) {
    return ''
  }

  return str
    .toLowerCase()
    .split(' ')
    .map((s) => capitalizeFirstLetter(s))
    .join(' ')
}

/**
 * Returns the given number as a string rounded to the hundredths place
 *
 * @param number - number to round
 *
 * @returns string of number rounded to the hundredths place
 */
export const roundToHundredthsPlace = (num: number): string => {
  return Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(num)
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

/**
 * Returns original string formatted in camel case from snake case input
 *
 * @param originalStr - snake case string split by underscores
 *
 * @returns original string in camel case
 */
export const snakeToCamelCase = (originalStr: string): string => {
  return originalStr.toLowerCase().replace(/_([a-z])/g, (_, char) => char.toUpperCase())
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
 * Converts 1234567890 to 123-456-7890
 * @param phoneNumber - string that has the phone number
 */
export const displayedTextPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6, 10)
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
  return t(`biometric.${translationTag}`)
}

/**
 * Makes the string received from the keychain getSupportedBiometryType call screen reader compatible
 * @param supportedBiometric - supported biometric as determined by keychain
 * @param t - translation function
 */
export const getSupportedBiometricA11yLabel = (supportedBiometric: string, t: TFunction): string => {
  switch (supportedBiometric) {
    case BIOMETRY_TYPE.FACE_ID:
      return t('biometric.faceID.a11yLabel')
    case BIOMETRY_TYPE.TOUCH_ID:
      return t('biometric.touchID.a11yLabel')
    case BIOMETRY_TYPE.FACE:
      return t('biometric.faceRecognition')
    case BIOMETRY_TYPE.FINGERPRINT:
      return t('biometric.fingerPrint')
    case BIOMETRY_TYPE.IRIS:
      return t('biometric.iris')
    default:
      return ''
  }
}

/**
 * Get a translation without using a type safe key, used when building keys programmatically.
 * @param key - translation key to translate
 * @param t - translation function
 * @param options - optional param for variables in interpolated translations
 */
export const getTranslation = (key: string, t: TFunction, options?: $Dictionary): string => {
  return options ? t(key, options) : t(key)
}

/**
 * Converts string amount to a number $2,200.40 to 2200.4
 * @param amount - the amount as a string, may have currency symbol
 */
export const strNumberToNumber = (amount: string): number => {
  // replace anything that is not a number with empty string
  return Number(amount.replace(/[^\d.]/g, ''))
}

/**
 * Convert string into USD currency string
 * @param amount - the amount as a number
 */
export const numberToUSDollars = (amount: number): string => {
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return USDollar.format(amount)
}

/**
 * Formats a Luxon DateTime object into a human-readable string.
 *
 * Uses Luxon's `toFormat` method with format token `EEEE, fff` to ensure consistent
 * timezone display across platforms (verified on Android & iOS). Previously used
 * `ZZZZ` token caused duplicated timezone abbreviations (e.g., "CDT CDT").
 *
 * Example output: "Saturday, May 31, 2025 at 9:00 PM CDT"
 *
 * @param dateTime - the Luxon DateTime object to format; may be null or undefined
 * @returns The formatted date-time string, or an empty string if dateTime is null or undefined
 */
export const formatDateTimeReadable = (dateTime?: DateTime | null): string => {
  if (!dateTime) {
    return ''
  }
  return dateTime.toFormat('EEEE, fff')
}

/**
 * Returns the date formatted in the format MMM yyyy
 *
 * @param date - DateTime object representing the date to format
 *
 * @returns date string formatted as MMM yyyy (e.g. "Jan 2025")
 */
export const formatDateMMMyyyy = (date: DateTime): string => {
  return getFormattedDate(date.toISO(), 'MMM yyyy')
}

/**
 * Returns the date range formatted in the format MMM yyyy
 *
 * @param startDate - DateTime object representing the start of the date range
 * @param endDate - DateTime object representing the end of the date range
 *
 * @returns date range string formatted as MMM yyyy (e.g. "Jan 2025 - Feb 2025")
 */
export const formatDateRangeMMMyyyy = (startDate: DateTime, endDate: DateTime): string => {
  return `${formatDateMMMyyyy(startDate)} - ${formatDateMMMyyyy(endDate)}`
}

export const formatEpochReadable = (epoch?: number): string => {
  if (!epoch) {
    return ''
  }

  return DateTime.fromSeconds(epoch).toFormat('LLLL d, y H:mm ZZZZ')
}
