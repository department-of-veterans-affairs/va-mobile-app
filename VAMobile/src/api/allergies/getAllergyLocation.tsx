import { useQuery } from '@tanstack/react-query'

import { VaccineLocationPayload } from 'api/types'
import { get } from 'store/api'

import { allergyKeys } from './queryKeys'

/**
 * Fetch user Vaccine Location
 */
const getAllergyLocation = async (locationId: string): Promise<VaccineLocationPayload | undefined> => {
  const response = await get<VaccineLocationPayload>(`/v0/health/locations/${locationId}`)
  return response
}

/**
 * Returns a query for user Vaccine Location
 */
export const useAllergyLocation = (locationId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [allergyKeys.allergyLocations, locationId],
    queryFn: () => getAllergyLocation(locationId),
    meta: {
      errorName: 'getAllergyLocation: Service error',
    },
    retry: 0,
  })
}
