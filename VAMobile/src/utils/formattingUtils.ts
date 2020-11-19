import { DateTime, DateTimeFormatOptions } from 'luxon'
import { format } from 'date-fns'

/**
 * Returns the formatted phone number
 *
 * @param phoneNumber - string signifying phone number w/ area code, i.e. 0001234567
 *
 * @returns string formatted for phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  return `(${phoneNumber.substring(0, 3)})-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
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
  const dateObj = DateTime.fromISO(dateTime)
  if (timeZone) {
    dateObj.setZone(timeZone)
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
 * Returns the date formatted in the format HH:MM aa TIMEZONE
 *
 * @param dateTime - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 * @param timeZone - string signifying the current timeZone i.e. America/Los_Angeles
 *
 * @returns  the date formatted in the format HH:MM aa TIMEZONE
 */
export const getFormattedTimeForTimeZone = (dateTime: string, timeZone: string): string => {
  return getFormattedDateOrTimeWithFormatOption(dateTime, DateTime.TIME_SIMPLE, timeZone, { timeZoneName: 'short' })
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
    const newDate = new Date(date)
    return format(
      new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate(), newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds()),
      formatBy,
    )
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
