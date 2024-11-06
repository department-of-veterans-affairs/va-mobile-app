import { useQuery } from '@tanstack/react-query'

import { UserAuthSettings } from 'api/types'
import { checkFirstTimeLogin } from 'utils/auth'

import { authKeys } from './queryKeys'

/**
 * Fetch user Auth Settings
 */
const getAuthSettings = async (): Promise<UserAuthSettings> => {
  const firstTimeLogin = await checkFirstTimeLogin()
  return {
    firstTimeLogin: firstTimeLogin,
  }
}

/**
 * Returns a query for user Auth Settings
 */
export const useAuthSettings = () => {
  return useQuery({
    staleTime: Infinity,
    queryKey: authKeys.settings,
    queryFn: () => getAuthSettings(),
    meta: {
      errorName: 'getAuthSettings: Service error',
    },
  })
}
