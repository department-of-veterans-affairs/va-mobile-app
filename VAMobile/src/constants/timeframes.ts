import { DateTime } from 'luxon'

export type TimeFrameType =
  | 'upcoming'
  | 'pastThreeMonths'
  | 'pastFiveToThreeMonths'
  | 'pastEightToSixMonths'
  | 'pastElevenToNineMonths'
  | 'pastFourteenToTwelveMonths'
  | 'pastAllCurrentYear'
  | 'pastAllLastYear'

export const TimeFrameTypeConstants: { [key: string]: TimeFrameType } = {
  UPCOMING: 'upcoming',
  PAST_THREE_MONTHS: 'pastThreeMonths',
  PAST_FIVE_TO_THREE_MONTHS: 'pastFiveToThreeMonths',
  PAST_EIGHT_TO_SIX_MONTHS: 'pastEightToSixMonths',
  PAST_ELEVEN_TO_NINE_MONTHS: 'pastElevenToNineMonths',
  PAST_FOURTEEN_TO_TWELVE_MONTHS: 'pastFourteenToTwelveMonths',
  PAST_ALL_CURRENT_YEAR: 'pastAllCurrentYear',
  PAST_ALL_LAST_YEAR: 'pastAllLastYear',
}

export const DEFAULT_UPCOMING_DAYS_LIMIT = 7

/**
 * Represents an inclusive date range used for time-frame filtering and pickers.
 *
 * The bounds are Luxon `DateTime` instances, typically normalized so that
 * `startDate` is at the start of day and `endDate` is at the end of day.
 *
 * Fields:
 * - startDate: The beginning of the time frame (inclusive).
 * - endDate: The end of the time frame (inclusive).
 */
export type TimeFrameDropDatePickerValue = {
  startDate: DateTime
  endDate: DateTime
}

/**
 * A selectable option for time-frame dropdowns used in filtering lists.
 *
 * Includes localized labels, accessibility text, a stable test identifier,
 * and the corresponding date range used to perform filtering.
 *
 * Fields:
 * - label: Human-readable text shown to users.
 * - value: Machine-friendly time-frame identifier.
 * - testID: Stable identifier for automated tests.
 * - a11yLabel: Screen-reader-friendly label.
 * - dates: Start/end bounds for this option.
 */
export type TimeFrameDropDownItem = {
  label: string
  value: TimeFrameType
  testID: string
  a11yLabel: string
  dates: TimeFrameDropDatePickerValue
}
