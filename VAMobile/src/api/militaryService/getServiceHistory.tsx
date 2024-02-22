import { useQuery } from '@tanstack/react-query'
import { max } from 'underscore'

import { MilitaryServiceHistoryData, ServiceData, ServiceHistoryAttributes, ServiceHistoryData } from 'api/types'
import { get } from 'store/api'
import { getDateFromString } from 'utils/formattingUtils'

import { militaryServiceHistoryKeys } from './queryKeys'

/**
 * Fetch user service history
 */
const getServiceHistory = async (): Promise<ServiceHistoryAttributes | undefined> => {
  const response = await get<MilitaryServiceHistoryData>('/v0/military-service-history')
  const serviceHistoryAttributes = response?.data.attributes
  const serviceHistoryData = serviceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const latestHistory = max(serviceHistoryData, (historyItem) => {
    return getDateFromString(historyItem.endDate)
  }) as ServiceData
  if (serviceHistoryAttributes) {
    return {
      ...serviceHistoryAttributes,
      mostRecentBranch: latestHistory?.branchOfService,
    }
  }
}

/**
 * Returns a query for user service history
 */
export const useServiceHistory = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: militaryServiceHistoryKeys.serviceHistory,
    queryFn: () => getServiceHistory(),
    meta: {
      errorName: 'getServiceHistory: Service error',
    },
  })
}
