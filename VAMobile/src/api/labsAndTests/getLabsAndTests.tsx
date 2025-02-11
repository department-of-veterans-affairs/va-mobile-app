import { useQuery } from '@tanstack/react-query'

import { LabsAndTestsListPayload } from 'api/types'
// import { LARGE_PAGE_SIZE } from 'constants/common'
import { get } from 'store/api'

import { labsAndTestsKeys } from './queryKeys'

/**
 * Fetch user Labs and Tests
 */
const getLabsAndTests = ({ dateRange }: LabsAndTestQuery): Promise<LabsAndTestsListPayload | undefined> => {
  return get<LabsAndTestsListPayload>(`/v0/health/labs-and-tests`, {
    page: '1',
    // 'page[size]': LARGE_PAGE_SIZE.toString(),
    // sort: 'date',
    useCache: 'false',
  })
}

export type LabsAndTestQuery = {
  dateRange: {
    start: string
    end: string
  }
}

/**
 * Returns a query for user Labs and  Tests
 */
export const useLabsAndTests = ({ dateRange }: LabsAndTestQuery, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [labsAndTestsKeys.labsAndTests],
    queryFn: () => getLabsAndTests({ dateRange }),
    meta: {
      errorName: 'getLabsAndTests: Service error',
    },
  })
}
