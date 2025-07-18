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

export type TimeFrameDropDownItem = {
  label: string
  value: string
  testID: string
  dates: {
    startDate: DateTime
    endDate: DateTime
  }
  timeFrame: TimeFrameType
}

export type DayMonthOrYearDropDownItem = {
  label: string
  value: string
  testID: string
}
