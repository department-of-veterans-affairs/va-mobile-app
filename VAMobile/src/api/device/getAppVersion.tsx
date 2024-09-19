import { useQuery } from '@tanstack/react-query'

import { getVersionName } from 'utils/deviceData'

import { deviceKeys } from './queryKeys'

/**
 * Returns a query for the installed app version on device
 */
export const useAppVersion = () => {
  return useQuery({
    queryKey: deviceKeys.appVersion,
    queryFn: () => getVersionName(),
    staleTime: Infinity,
    meta: {
      errorName: 'getAppVersion: Error getting app version',
    },
  })
}
