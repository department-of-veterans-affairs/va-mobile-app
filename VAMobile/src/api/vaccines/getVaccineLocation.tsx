import { useQuery } from '@tanstack/react-query'

import { VaccineLocationPayload } from 'api/types'
import { get } from 'store/api'

import { vaccineKeys } from './queryKeys'

/**
 * Fetch user VaccinesLocation
 */
const getVaccinesLocation = async (locationId: string): Promise<VaccineLocationPayload | undefined> => {
  const response = await get<VaccineLocationPayload>(`/v0/health/locations/${locationId}`)
  return response
}

/**
 * Returns a query for user VaccinesLocation
 */
export const useVaccinesLocation = (locationId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [vaccineKeys.vaccineLocations, locationId],
    queryFn: () => getVaccinesLocation(locationId),
    meta: {
      errorName: 'getVaccinesLocation: Service error',
    },
  })
}
