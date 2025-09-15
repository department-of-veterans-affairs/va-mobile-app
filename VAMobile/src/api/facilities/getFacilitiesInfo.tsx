import { facilitiesKeys } from 'api/facilities/queryKeys'
import { useQuery } from 'api/queryClient'
import { FacilitiesPayload, Facility } from 'api/types/FacilityData'
import { get } from 'store/api'

/**
 * Fetch user facilities info
 */

const getFacilitiesInfo = async (): Promise<Array<Facility> | undefined> => {
  const response = await get<FacilitiesPayload>('/v0/facilities-info')
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
