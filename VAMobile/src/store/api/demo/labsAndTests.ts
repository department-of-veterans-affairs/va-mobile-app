import { LabsAndTestsListPayload } from 'api/types/LabsAndTestsData'
import { DemoStore } from 'store/api/demo/store'
import { Params } from 'store/api/index'
import { getDateMonthsAgo } from 'utils/dateUtils'

function getTestDataDateRangeStore(endpoint: string, endDate: Date, store: DemoStore): LabsAndTestsListPayload {
  const threeMonthsEarlier = getDateMonthsAgo(2, 'start', 'start')
  const fiveMonthsEarlier = getDateMonthsAgo(5, 'start', 'start')
  const eightMonthsEarlier = getDateMonthsAgo(8, 'start', 'start')
  const elevenMonthsEarlier = getDateMonthsAgo(11, 'start', 'start')
  const fourteenMonthsEarlier = getDateMonthsAgo(14, 'start', 'start')

  if (endDate >= threeMonthsEarlier.toJSDate()) {
    return store['/v1/health/labs-and-tests'].PAST_THREE_MONTHS
  } else if (endDate >= fiveMonthsEarlier.toJSDate() && endDate < threeMonthsEarlier.toJSDate()) {
    return store['/v1/health/labs-and-tests'].PAST_FOUR_TO_SIX_MONTHS
  } else if (endDate >= eightMonthsEarlier.toJSDate() && endDate < fiveMonthsEarlier.toJSDate()) {
    return store['/v1/health/labs-and-tests'].PAST_SEVEN_TO_NINE_MONTHS
  } else if (endDate >= elevenMonthsEarlier.toJSDate() && endDate < eightMonthsEarlier.toJSDate()) {
    return store['/v1/health/labs-and-tests'].PAST_TEN_TO_TWELVE_MONTHS
  } else if (endDate >= fourteenMonthsEarlier.toJSDate() && endDate < elevenMonthsEarlier.toJSDate()) {
    return store['/v1/health/labs-and-tests'].PAST_THIRTEEN_TO_FIFTEEN_MONTHS
  } else {
    return store['/v1/health/labs-and-tests'].PAST_THREE_MONTHS
  }
}

/**
 * Type denoting the demo data store
 */
export type LabsAndTestsList = {
  '/v1/health/labs-and-tests': {
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
  const endDate = new Date(params.endDate.toString())
  return getTestDataDateRangeStore(endpoint, endDate, store)
}
