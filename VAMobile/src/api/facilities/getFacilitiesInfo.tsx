import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { FacilitiesPayload, Facility } from 'api/types/FacilityData'
import { get } from 'store/api'

import { facilitiesKeys } from './queryKeys'

/**
 * Fetch user facilities info
 */

const getFacilitiesInfo = async (queryClient: QueryClient): Promise<Array<Facility> | undefined> => {
  const response = await get<FacilitiesPayload>(
    '/v0/facilities-info',
    undefined,
    facilitiesKeys.facilities,
    queryClient,
  )
  return response?.data.attributes.facilities
}

/**
 * Returns a query for a user's facility information
 */
export const useFacilitiesInfo = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: facilitiesKeys.facilities,
    queryFn: () => getFacilitiesInfo(queryClient),
    meta: {
      errorName: 'getFacilitiesInfo: Service error',
    },
    staleTime: Infinity,
  })
}
