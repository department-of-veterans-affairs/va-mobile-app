import { useQuery } from '@tanstack/react-query'

import { FacilitiesPayload, Facility } from 'api/types/FacilityData'
import { facilitiesKeys } from './queryKeys'
import { get } from 'store/api'

/**
 * Fetch user facilities info
 */

const getFacilitiesInfo = async (): Promise<Array<Facility> | undefined> => {
  const response = await get<FacilitiesPayload>('/v0/facilities-info')
  return response?.data.attributes.facilities
}

/**
 * Returns a query for user demographics
 */
export const useFacilitiesInfo = () => {
  return useQuery({
    queryKey: facilitiesKeys.facilities,
    queryFn: () => getFacilitiesInfo(),
    meta: {
      errorName: 'getFacilitiesInfo: Service error',
    },
  })
}
