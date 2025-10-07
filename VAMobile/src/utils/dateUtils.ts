import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { TimeFrameDropDownItem, TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { formatDateMMMyyyy, formatDateRangeMMMyyyy } from 'utils/formattingUtils'

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
  const dateMonthsAgo = DateTime.local().minus({ months: monthsAgo })

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

export const getListOfYearsSinceYear = (startingYear: number): string[] => {
  const years = []
  const currentYear = DateTime.local().year
  for (let year = currentYear; year >= startingYear; year--) {
    years.push(year.toString())
  }
  return years
}

export const getCurrentMonth = (): string => {
  return DateTime.local().toFormat('MMMM')
}
export const getMonthNumber = (month: string): number => {
  const months = MONTHS
  const monthIndex = months.indexOf(month)
  return monthIndex !== -1 ? monthIndex + 1 : -1
}

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * Creates a complete mapping of all time frame types to their corresponding date ranges.
 * Each date range contains DateTime objects representing the start and end boundaries
 * for filtering travel pay claims by time period.
 *
 * @returns A record mapping each TimeFrameTypeConstant to an object containing:
 *   - startDate: DateTime object marking the beginning of the time period
 *   - endDate: DateTime object marking the end of the time period
 *
 * @example
 * ```typescript
 * const dateRanges = createTimeFrameDateRangeMap();
 * const pastThreeMonthsRange = dateRanges[TimeFrameTypeConstants.PAST_THREE_MONTHS];
 * console.log(pastThreeMonthsRange.startDate.toISO()); // "2024-01-15T00:00:00.000-05:00"
 * ```
 */
export const createTimeFrameDateRangeMap = () => {
  const futureDate = todaysDate.plus({ days: 390 })

  const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
  const threeMonthsEarlier = todaysDate.minus({ months: 3 })

  const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
  const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')

  const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
  const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')

  const fourteenMonthsEarlier = todaysDate.minus({ months: 14 }).startOf('month').startOf('day')
  const twelveMonthsEarlier = todaysDate.minus({ months: 12 }).endOf('month').endOf('day')

  const firstDayCurrentYear = todaysDate.set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 0 })

  const lastYearDateTime = todaysDate.minus({ years: 1 })
  const firstDayLastYear = lastYearDateTime.set({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
  const lastDayLastYear = lastYearDateTime.set({
    month: 12,
    day: 31,
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
  })

  return {
    [TimeFrameTypeConstants.UPCOMING]: {
      startDate: todaysDate.startOf('day'),
      endDate: futureDate.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_THREE_MONTHS]: {
      startDate: threeMonthsEarlier.startOf('day'),
      endDate: todaysDate.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]: {
      startDate: fiveMonthsEarlier.startOf('day'),
      endDate: threeMonthsEarlier.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS]: {
      startDate: eightMonthsEarlier.startOf('day'),
      endDate: sixMonthsEarlier.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS]: {
      startDate: elevenMonthsEarlier.startOf('day'),
      endDate: nineMonthsEarlier.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS]: {
      startDate: fourteenMonthsEarlier.startOf('day'),
      endDate: twelveMonthsEarlier.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR]: {
      startDate: firstDayCurrentYear,
      endDate: todaysDate.endOf('day'),
    },
    [TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]: {
      startDate: firstDayLastYear,
      endDate: lastDayLastYear,
    },
  }
}

/**
 * Retrieves the date range for a specific time frame type and converts it to ISO string format.
 * This function is commonly used for API calls that require date ranges as strings.
 *
 * @param timeFrameType - The time frame type to get the date range for
 * @returns An object containing startDate and endDate as ISO strings
 *
 * @example
 * ```typescript
 * const range = getDateRangeFromTimeFrame(TimeFrameTypeConstants.PAST_THREE_MONTHS);
 * console.log(range); // { startDate: "2024-01-15T00:00:00.000-05:00", endDate: "2024-04-15T23:59:59.999-04:00" }
 * ```
 */
export const getDateRangeFromTimeFrame = (timeFrameType: TimeFrameType) => {
  const dateRange = createTimeFrameDateRangeMap()[timeFrameType]

  return {
    startDate: dateRange.startDate.toISO(),
    endDate: dateRange.endDate.toISO(),
  }
}

/**
 * Creates localized picker options for time-frame filtering in lists.
 *
 * Generates an ordered array of `TimeFrameDropDownItem` entries with:
 * - label: human-readable text for display
 * - value: `TimeFrameTypeConstants` enum value
 * - a11yLabel: screen-reader-friendly label
 * - testID: stable identifier for E2E tests
 * - dates: start and end `DateTime` bounds used for filtering
 *
 * Translation keys can be overridden via `tKeys`; when omitted, sensible
 * defaults for Past Appointments are used.
 *
 * @param t - i18next `TFunction` used to translate labels and a11y text.
 * @param tKeys - Optional overrides for translation keys.
 * @returns Array of `TimeFrameDropDownItem` representing available time frames.
 *
 * @example
 * const items = getPickerOptions(t);
 * items[0].value === TimeFrameTypeConstants.PAST_THREE_MONTHS
 */
export const getPickerOptions = (
  t: TFunction,
  tKeys?: {
    dateRangeA11yLabelTKey: string
    allOfTKey: string
    pastThreeMonthsTKey: string
  },
): Array<TimeFrameDropDownItem> => {
  const { dateRangeA11yLabelTKey, allOfTKey, pastThreeMonthsTKey } = tKeys || {
    dateRangeA11yLabelTKey: 'pastAppointments.dateRangeA11yLabel',
    allOfTKey: 'pastAppointments.allOf',
    pastThreeMonthsTKey: 'pastAppointments.pastThreeMonths',
  }
  const map = createTimeFrameDateRangeMap()

  const fiveMonthsToThreeMonths = map[TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]
  const eightMonthsToSixMonths = map[TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS]
  const elevenMonthsToNineMonths = map[TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS]
  const pastAllCurrentYear = map[TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR]
  const pastAllLastYear = map[TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]

  return [
    {
      label: t(pastThreeMonthsTKey),
      value: TimeFrameTypeConstants.PAST_THREE_MONTHS,
      a11yLabel: t(pastThreeMonthsTKey),
      dates: {
        startDate: fiveMonthsToThreeMonths.startDate,
        endDate: fiveMonthsToThreeMonths.endDate,
      },
    },
    {
      label: formatDateRangeMMMyyyy(fiveMonthsToThreeMonths.startDate, fiveMonthsToThreeMonths.endDate),
      value: TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
      a11yLabel: t(dateRangeA11yLabelTKey, {
        date1: formatDateMMMyyyy(fiveMonthsToThreeMonths.startDate),
        date2: formatDateMMMyyyy(fiveMonthsToThreeMonths.endDate),
      }),
      dates: {
        startDate: fiveMonthsToThreeMonths.startDate,
        endDate: fiveMonthsToThreeMonths.endDate,
      },
    },
    {
      label: formatDateRangeMMMyyyy(eightMonthsToSixMonths.startDate, eightMonthsToSixMonths.endDate),
      value: TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
      a11yLabel: t(dateRangeA11yLabelTKey, {
        date1: formatDateMMMyyyy(eightMonthsToSixMonths.startDate),
        date2: formatDateMMMyyyy(eightMonthsToSixMonths.endDate),
      }),
      dates: {
        startDate: eightMonthsToSixMonths.startDate,
        endDate: eightMonthsToSixMonths.endDate,
      },
    },
    {
      label: formatDateRangeMMMyyyy(elevenMonthsToNineMonths.startDate, elevenMonthsToNineMonths.endDate),
      value: TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
      a11yLabel: t(dateRangeA11yLabelTKey, {
        date1: formatDateMMMyyyy(elevenMonthsToNineMonths.startDate),
        date2: formatDateMMMyyyy(elevenMonthsToNineMonths.endDate),
      }),
      dates: {
        startDate: elevenMonthsToNineMonths.startDate,
        endDate: elevenMonthsToNineMonths.endDate,
      },
    },
    {
      label: t(allOfTKey, { year: pastAllCurrentYear.startDate.year }),
      value: TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
      a11yLabel: t(allOfTKey, { year: pastAllCurrentYear.startDate.year }),
      dates: {
        startDate: pastAllCurrentYear.startDate,
        endDate: pastAllCurrentYear.endDate,
      },
    },
    {
      label: t(allOfTKey, { year: pastAllLastYear.startDate.year }),
      value: TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      a11yLabel: t(allOfTKey, { year: pastAllLastYear.startDate.year }),
      dates: {
        startDate: pastAllLastYear.startDate,
        endDate: pastAllLastYear.endDate,
      },
    },
  ]
}
