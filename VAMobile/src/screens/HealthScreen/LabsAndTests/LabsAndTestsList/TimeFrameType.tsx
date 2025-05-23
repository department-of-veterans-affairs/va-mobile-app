import { DateTime } from 'luxon'

export type TimeFrameType =
  | 'upcoming'
  | 'pastThreeMonths'
  | 'pastFiveToThreeMonths'
  | 'pastEightToSixMonths'
  | 'pastElevenToNineMonths'
  | 'pastFourteenToTwelveMonths'

export type TimeFrameDropDownItem = {
  label: string
  value: string
  a11yLabel: string
  dates: {
    startDate: DateTime
    endDate: DateTime
  }
  timeFrame: TimeFrameType
}
