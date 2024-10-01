import { useQuery } from '@tanstack/react-query'

import { VaccineLocationPayload } from 'api/types'
import { get } from 'store/api'

import { vaccineKeys } from './queryKeys'

/**
 * Fetch user Vaccine Location
 */
const getVaccineLocation = async (locationId: string): Promise<VaccineLocationPayload | undefined> => {
  const response = await get<VaccineLocationPayload>(
    `/v0/health/locations/${locationId}`,
    undefined,
    vaccineKeys.vaccineLocations,
  )
  return response
}

/**
 * Returns a query for user Vaccine Location
 */
export const useVaccineLocation = (locationId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [vaccineKeys.vaccineLocations, locationId],
    queryFn: () => getVaccineLocation(locationId),
    meta: {
      errorName: 'getVaccineLocation: Service error',
    },
    retry: 0,
  })
}
