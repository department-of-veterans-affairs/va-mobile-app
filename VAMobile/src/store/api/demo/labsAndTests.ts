import { DateTime } from 'luxon'

import { LabsAndTestsListPayload } from 'api/types/LabsAndTestsData'

import { Params } from '..'
import { DemoStore } from './store'

function parseDate(dateString: string): Date {
  const [month, day, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getTestDataDateRangeStore(endpoint: string, endDate: Date, store: DemoStore): LabsAndTestsListPayload {
  const todaysDate = DateTime.local()
  const threeMonthsEarlier = todaysDate.minus({ months: 3 }).endOf('month').endOf('day')
  const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
  const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
  const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
  const fourteenMonthsEarlier = todaysDate.minus({ months: 14 }).startOf('month').startOf('day')

  if (endDate >= threeMonthsEarlier.toJSDate()) {
    return store['/v0/health/labs-and-tests'].PAST_THREE_MONTHS
  } else if (endDate >= fiveMonthsEarlier.toJSDate() && endDate < threeMonthsEarlier.toJSDate()) {
    return store['/v0/health/labs-and-tests'].PAST_FOUR_TO_SIX_MONTHS
  } else if (endDate >= eightMonthsEarlier.toJSDate() && endDate < fiveMonthsEarlier.toJSDate()) {
    return store['/v0/health/labs-and-tests'].PAST_SEVEN_TO_NINE_MONTHS
  } else if (endDate >= elevenMonthsEarlier.toJSDate() && endDate < eightMonthsEarlier.toJSDate()) {
    return store['/v0/health/labs-and-tests'].PAST_TEN_TO_TWELVE_MONTHS
  } else if (endDate >= fourteenMonthsEarlier.toJSDate() && endDate < elevenMonthsEarlier.toJSDate()) {
    return store['/v0/health/labs-and-tests'].PAST_THIRTEEN_TO_FIFTEEN_MONTHS
  } else {
    return store['/v0/health/labs-and-tests'].PAST_THREE_MONTHS
  }
}

/**
 * Type denoting the demo data store
 */
export type LabsAndTestsList = {
  '/v0/health/labs-and-tests': {
    PAST_THREE_MONTHS: LabsAndTestsListPayload
    PAST_FOUR_TO_SIX_MONTHS: LabsAndTestsListPayload
    PAST_SEVEN_TO_NINE_MONTHS: LabsAndTestsListPayload
    PAST_TEN_TO_TWELVE_MONTHS: LabsAndTestsListPayload
    PAST_THIRTEEN_TO_FIFTEEN_MONTHS: LabsAndTestsListPayload
  }
}

export type LabsAndTestsDemoStore = LabsAndTestsList

/**
 * Type to define the mock returns to keep type safety
 */
export type LabsAndTestsDemoReturnTypes = undefined | LabsAndTestsListPayload

export const getLabsAndTestsList = (store: DemoStore, params: Params, endpoint: string): LabsAndTestsListPayload => {
  const endDate = params.endDate
  return getTestDataDateRangeStore(endpoint, parseDate(endDate.toString()), store)
}
