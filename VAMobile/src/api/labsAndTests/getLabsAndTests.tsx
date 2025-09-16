import { labsAndTestsKeys } from 'api/labsAndTests/queryKeys'
import { useQuery } from 'api/queryClient'
import { LabsAndTestsListPayload } from 'api/types'
import { get } from 'store/api'

export type LabsAndTestQuery = {
  dateRange: {
    start: string
    end: string
  }
  page?: string
  timeFrame?: string
}

/**
 * Fetch user Labs and Tests
 */
const getLabsAndTests = ({ dateRange, page = '1' }: LabsAndTestQuery): Promise<LabsAndTestsListPayload | undefined> => {
  return get<LabsAndTestsListPayload>(`/v1/health/labs-and-tests`, {
    startDate: dateRange.start,
    endDate: dateRange.end,
    page,
    useCache: 'false',
  })
}

/**
 * Returns a query for user Labs  and Tests
 */
export const useLabsAndTests = ({ dateRange, timeFrame }: LabsAndTestQuery, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [labsAndTestsKeys.labsAndTests, timeFrame],
    queryFn: () => getLabsAndTests({ dateRange }),
    meta: {
      errorName: 'getLabsAndTests: Service error',
    },
  })
}
