export type TimeFrameType = 'upcoming' | 'pastThreeMonths' | 'pastFiveToThreeMonths' | 'pastEightToSixMonths' | 'pastElevenToNineMonths' | 'pastAllCurrentYear' | 'pastAllLastYear'

export const TimeFrameTypeConstants: { [key: string]: TimeFrameType } = {
  UPCOMING: 'upcoming',
  PAST_THREE_MONTHS: 'pastThreeMonths',
  PAST_FIVE_TO_THREE_MONTHS: 'pastFiveToThreeMonths',
  PAST_EIGHT_TO_SIX_MONTHS: 'pastEightToSixMonths',
  PAST_ELEVEN_TO_NINE_MONTHS: 'pastElevenToNineMonths',
  PAST_ALL_CURRENT_YEAR: 'pastAllCurrentYear',
  PAST_ALL_LAST_YEAR: 'pastAllLastYear',
}
