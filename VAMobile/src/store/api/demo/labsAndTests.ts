import { LabsAndTestsListPayload } from 'api/types/LabsAndTestsData'

import { Params } from '..'
import { DemoStore } from './store'

function parseDate(dateString: string): Date {
  const [month, day, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}
function monthsAgo(endDate: string): number {
  const end = parseDate(endDate)
  const now = new Date()

  const yearsDifference = now.getFullYear() - end.getFullYear()
  const monthsDifference = now.getMonth() - end.getMonth()

  return yearsDifference * 12 + monthsDifference
}

type LabsAndTestsPageNumber = '1'

/**
 * Type denoting the demo data store
 */
export type LabsAndTestsList = {
  '/v0/health/labs-and-tests': {
    '1': LabsAndTestsListPayload
    PAST_THREE_MONTHS: LabsAndTestsListPayload
    PAST_FOUR_TO_SIX_MONTHS: LabsAndTestsListPayload
    PAST_SEVEN_TO_NINE_MONTHS: LabsAndTestsListPayload
    PAST_TEN_TO_TWELVE_MONTHS: LabsAndTestsListPayload
  }
}

// TODO - rethink how the 'months ago' is being calculated and used and set up test data appropriately

export type LabsAndTestsDemoStore = LabsAndTestsList

/**
 * Type to define the mock returns to keep type safety
 */
export type LabsAndTestsDemoReturnTypes = undefined | LabsAndTestsListPayload

export const getLabsAndTestsList = (store: DemoStore, params: Params, endpoint: string): LabsAndTestsListPayload => {
  const page = params.page
  const endDate = params.endDate
  console.log('page:', page, ' -- endDate: ', endDate)
  //compute how many months ago endDate is in the past
  console.log('end date months ago: ', monthsAgo(endDate.toString()))
  const computedMonths = monthsAgo(endDate.toString())
  if (!endDate || computedMonths <= 2) {
    console.log('PAST THREE MONTHS')
    return store['/v0/health/labs-and-tests'].PAST_THREE_MONTHS
  } else if (computedMonths >= 3 && computedMonths <= 5) {
    console.log('PAST FOUR TO SIX MONTHS')
    return store['/v0/health/labs-and-tests'].PAST_FOUR_TO_SIX_MONTHS
  } else if (computedMonths >= 6 && computedMonths <= 8) {
    console.log('PAST SEVEN TO NINE MONTHS')
    return store['/v0/health/labs-and-tests'].PAST_SEVEN_TO_NINE_MONTHS
  } else if (computedMonths >= 9 && computedMonths <= 11) {
    console.log('PAST TEN TO TWELVE MONTHS')
    return store['/v0/health/labs-and-tests'].PAST_TEN_TO_TWELVE_MONTHS
  } else return store[endpoint as keyof LabsAndTestsList][page as LabsAndTestsPageNumber] as LabsAndTestsListPayload
}
