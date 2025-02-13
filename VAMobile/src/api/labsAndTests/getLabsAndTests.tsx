import { useQuery } from '@tanstack/react-query'

import { LabsAndTestsListPayload } from 'api/types'
// import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

import { labsAndTestsKeys } from './queryKeys'

export type LabsAndTestQuery = {
  dateRange: {
    start: string
    end: string
  }
  page?: string
  timeFrame?: string
  labTypes?: string[]
}

const defaultLabTypes = ['SP']

/**
 * Fetch user Labs and Tests
 */
const getLabsAndTests = ({
  dateRange,
  page = '1',
  labTypes = defaultLabTypes,
}: LabsAndTestQuery): Promise<LabsAndTestsListPayload | undefined> => {
  return get<LabsAndTestsListPayload>(`/v0/health/labs-and-tests`, {
    startDate: dateRange.start,
    endDate: dateRange.end,
    page,
    labTypes,
    useCache: 'false',
  })
}

/**
 * Returns a query for user Labs and  Tests
 */
export const useLabsAndTests = (
  { dateRange, timeFrame, labTypes }: LabsAndTestQuery,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...options,
    queryKey: [labsAndTestsKeys.labsAndTests, timeFrame, labTypes],
    queryFn: () => getLabsAndTests({ dateRange }),
    meta: {
      errorName: 'getLabsAndTests: Service error',
    },
  })
}
