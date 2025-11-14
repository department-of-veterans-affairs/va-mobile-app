import { DateTime, Interval } from 'luxon'

import { LabsAndTests, LabsAndTestsListPayload } from 'api/types/LabsAndTestsData'
import { DemoStore } from 'store/api/demo/store'
import { Params } from 'store/api/index'

/**
 * Type denoting the demo data store
 */
export type LabsAndTestsList = {
  '/v1/health/labs-and-tests': {
    '2024': {
      '1': LabsAndTestsListPayload
      '12': LabsAndTestsListPayload
    }
    '2023': {
      '2': LabsAndTestsListPayload
      '10': LabsAndTestsListPayload
    }
    DEFAULT: LabsAndTestsListPayload
  }
}

export type LabsAndTestsDemoStore = LabsAndTestsList

/**
 * Type to define the mock returns to keep type safety
 */
export type LabsAndTestsDemoReturnTypes = undefined | LabsAndTestsListPayload

export const getLabsAndTestsList = (store: DemoStore, params: Params): LabsAndTestsListPayload => {
  const startDate = params.startDate as string
  const endDate = params.endDate as string

  if (startDate && endDate) {
    // Get all records from the DEFAULT dataset
    const defaultRecords = store['/v1/health/labs-and-tests'].DEFAULT

    // Create a date interval for filtering
    const interval = Interval.fromDateTimes(DateTime.fromISO(startDate), DateTime.fromISO(endDate))

    // Filter records that fall within the date range
    const filteredData = defaultRecords.data.filter((record: LabsAndTests) => {
      const dateCompleted = record.attributes?.dateCompleted
      if (!dateCompleted) {
        return false
      }
      const recordDate = DateTime.fromISO(dateCompleted)
      return interval.contains(recordDate)
    })

    // Return the filtered results
    return {
      ...defaultRecords,
      data: filteredData,
    }
  }

  // Fallback to DEFAULT if no date range provided
  return store['/v1/health/labs-and-tests'].DEFAULT
}
