import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, VaccineLocationPayload } from 'api/types'
import { get } from 'store/api'

import { vaccineKeys } from './queryKeys'

/**
 * Fetch user Vaccine Location
 */
const getVaccineLocation = async (
  locationId: string,
  queryClient: QueryClient,
): Promise<VaccineLocationPayload | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === vaccineKeys.vaccineLocations[0]) {
        throw error.error
      }
    })
  }

  const response = await get<VaccineLocationPayload>(`/v0/health/locations/${locationId}`)
  return response
}

/**
 * Returns a query for user Vaccine Location
 */
export const useVaccineLocation = (locationId: string, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    queryKey: [vaccineKeys.vaccineLocations, locationId],
    queryFn: () => getVaccineLocation(locationId, queryClient),
    meta: {
      errorName: 'getVaccineLocation: Service error',
    },
    retry: 0,
  })
}
