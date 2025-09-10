export type TimeFrameType =
  | 'upcoming'
  | 'pastThreeMonths'
  | 'pastFiveToThreeMonths'
  | 'pastEightToSixMonths'
  | 'pastElevenToNineMonths'
  | 'pastAllCurrentYear'
  | 'pastAllLastYear'
  | 'pastSixMonths'
  | 'pastNineMonths'
  | 'pastOneYear'
  | 'pastTwoYears'

export const TimeFrameTypeConstants: { [key: string]: TimeFrameType } = {
  UPCOMING: 'upcoming',
  PAST_THREE_MONTHS: 'pastThreeMonths',
  PAST_FIVE_TO_THREE_MONTHS: 'pastFiveToThreeMonths',
  PAST_EIGHT_TO_SIX_MONTHS: 'pastEightToSixMonths',
  PAST_ELEVEN_TO_NINE_MONTHS: 'pastElevenToNineMonths',
  PAST_ALL_CURRENT_YEAR: 'pastAllCurrentYear',
  PAST_ALL_LAST_YEAR: 'pastAllLastYear',
  PAST_SIX_MONTHS: 'pastSixMonths',
  PAST_NINE_MONTHS: 'pastNineMonths',
  PAST_ONE_YEAR: 'pastOneYear',
  PAST_TWO_YEARS: 'pastTwoYears',
}

export const DEFAULT_UPCOMING_DAYS_LIMIT = 30
