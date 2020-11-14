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
 * Returns the date formatted in the format MMMM dd, yyyy
 *
 * @param date - string signifying the raw date, i.e. 2013-06-06T04:00:00.000+00:00
 *
 * @returns date string formatted as MMMM dd, yyyy
 */
export const formatDateMMMMDDYYYY = (date: string): string => {
  if (date) {
    const newDate = new Date(date)
    return format(new Date(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getUTCDate()), 'MMMM dd, yyyy')
  }

  return ''
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
