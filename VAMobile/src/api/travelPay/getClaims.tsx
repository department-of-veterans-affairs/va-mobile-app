import { useInfiniteQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import { GetTravelPayClaimsParams, GetTravelPayClaimsResponse } from 'api/types'
import { TimeFrameType } from 'constants/timeframes'
import { DowntimeFeatureTypeConstants, Params, get } from 'store/api'
import { getDateRangeFromTimeFrame } from 'utils/dateUtils'
import { useDowntime } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch paginated travel pay claims
 */
const getClaims = async (params: GetTravelPayClaimsParams): Promise<GetTravelPayClaimsResponse | undefined> => {
  const adjustedParams: {
    start_date: string
    end_date: string
    page_number?: number
  } = {
    start_date: params.startDate,
    end_date: params.endDate,
  }

  if (params.pageNumber !== undefined) {
    adjustedParams.page_number = params.pageNumber
  }

  return await get<GetTravelPayClaimsResponse>('/v0/travel-pay/claims', adjustedParams as unknown as Params)
}

/**
 * Returns a query for paginated travel pay claims
 */
export const useTravelPayClaims = (timeFrameType: TimeFrameType) => {
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPayStatusList')

  return useInfiniteQuery({
    queryKey: [travelPayKeys.claims, timeFrameType],
    queryFn: ({ pageParam }) => getClaims({ ...getDateRangeFromTimeFrame(timeFrameType), pageNumber: pageParam }),
    enabled: travelPayEnabled,
    meta: {
      errorName: 'getTravelPayClaims: Service error',
    },
    getPreviousPageParam: (firstPage) => {
      const pageNumber = firstPage?.meta?.pageNumber
      return pageNumber && pageNumber > 1 ? pageNumber - 1 : undefined
    },
    getNextPageParam: (lastPage) => {
      const pageNumber = lastPage?.meta?.pageNumber
      const totalRecordCount = lastPage?.meta?.totalRecordCount
      const currentPageSize = lastPage?.data?.length || 0

      // If we have more records to fetch, return the next page number
      if (pageNumber && totalRecordCount && pageNumber * currentPageSize < totalRecordCount) {
        return pageNumber + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
}
