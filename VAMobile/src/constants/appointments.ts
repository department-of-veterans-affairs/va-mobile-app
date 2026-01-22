export type TimeFrameType =
  | 'upcoming'
  | 'pastOneMonth'
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
  PAST_ONE_MONTH: 'pastOneMonth',
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

/*
 Matching value MUST be found in `appointments.afterVisitSummary.review.${value}` in common.json
 e.g., `appointments.afterVisitSummary.review.afterVisitSummary`
*/

// Oracle Health appointment summary types to include as after visit summaries
export const AfterVisitSummaryToIncludeOH: Record<string, string> = {
  ambulatory_patient_summary: 'afterVisitSummary',
}

// VistA does not have PDFs for after visit summaries yet
export const AfterVisitSummaryToIncludeVistA: Record<string, string> = {} // will likely have a type that matches to afterVisitSummary in the future
