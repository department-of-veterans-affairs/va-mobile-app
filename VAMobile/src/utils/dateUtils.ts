import { DateTime } from 'luxon'

export const todaysDate = DateTime.local()

/**
 * Returns a DateTime object representing a date n months ago from the current date
 * The returned DateTime will be set to the beginning or end of the month based on the 'position' parameter
 *
 * @param monthsAgo - number of months to go back from current date
 * @param position - 'start' to get the first day of the month, 'end' to get the last day of the month
 * @param timePosition - 'start' to set time to beginning of the day, 'end' to set time to end of the day
 *
 * @returns DateTime object representing the date n months ago with specified position
 */
export const getDateMonthsAgo = (
  monthsAgo: number,
  position: 'start' | 'end' = 'start',
  timePosition: 'start' | 'end' = 'start',
): DateTime => {
  const dateMonthsAgo = todaysDate.minus({ months: monthsAgo })

  const positionedDate = position === 'start' ? dateMonthsAgo.startOf('month') : dateMonthsAgo.endOf('month')

  return timePosition === 'start' ? positionedDate.startOf('day') : positionedDate.endOf('day')
}

/**
 * Returns the date formatted utilizing the formatBy parameter
 *
 * NOTE: replcated from formattingUtils.ts, need to migrate other users to this function
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
 * Returns a date formatted for optimal screen reader accessibility
 *
 * @param date - string signifying the raw date (ISO format), i.e. 2013-06-06T04:00:00.000+00:00
 *               or a DateTime object
 *
 * @returns string formatted for screen readers (e.g., "January 1, 2025" or "January 1st, 2025")
 */
export const getAccessibleDate = (date: string | DateTime | null): string => {
  if (!date) {
    return ''
  }

  const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : date

  if (!dateTime.isValid) {
    return ''
  }

  const format = 'MMMM d, yyyy'
  return dateTime.toLocal().toFormat(format)
}

/**
 * Returns a formatted date range string from start and end dates
 *
 * @param startDate - DateTime object representing the start of the date range
 * @param endDate - DateTime object representing the end of the date range
 * @param formatBy - string signifying how each date should be formatted, i.e. MMMM dd, yyyy
 *                   defaults to 'MMM yyyy' if not specified
 *
 * @returns string representing the formatted date range
 */
export const getDateRange = (startDate: DateTime, endDate: DateTime, formatBy: string = 'MMM yyyy'): string => {
  return `${getFormattedDate(startDate.toISO(), formatBy)} - ${getFormattedDate(endDate.toISO(), formatBy)}`
}
