import { useQuery } from '@tanstack/react-query'

import { FacilitiesPayload, Facility } from 'api/types/FacilityData'
import { get } from 'store/api'

import { facilitiesKeys } from './queryKeys'

/**
 * Fetch user facilities info
 */

const getFacilitiesInfo = async (): Promise<Array<Facility> | undefined> => {
  const response = await get<FacilitiesPayload>('/v0/facilities-info', undefined, facilitiesKeys.facilities)
  return response?.data.attributes.facilities
}

/**
 * Returns a query for a user's facility information
 */
export const useFacilitiesInfo = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: facilitiesKeys.facilities,
    queryFn: () => getFacilitiesInfo(),
    meta: {
      errorName: 'getFacilitiesInfo: Service error',
    },
    staleTime: Infinity,
  })
}
