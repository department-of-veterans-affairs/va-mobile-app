import { deviceKeys } from 'api/device/queryKeys'
import { useQuery } from 'api/queryClient'
import { getVersionName } from 'utils/deviceData'

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
