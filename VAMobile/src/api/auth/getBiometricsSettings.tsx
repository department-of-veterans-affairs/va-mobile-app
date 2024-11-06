import { useQuery } from '@tanstack/react-query'

import { UserBiometricsSettings } from 'api/types'
import { deviceSupportedBiometrics, isBiometricsPreferred } from 'utils/auth'

import { authKeys } from './queryKeys'

/**
 * Fetch user Biometrics Settings
 */
const getBiometricsSettings = async (): Promise<UserBiometricsSettings> => {
  const supportedBiometric = await deviceSupportedBiometrics()
  const biometricsPreferred = await isBiometricsPreferred()
  return {
    canStoreWithBiometric: !!supportedBiometric,
    shouldStoreWithBiometric: biometricsPreferred,
    supportedBiometric: supportedBiometric,
  }
}

/**
 * Returns a query for user Biometrics Settings
 */
export const useBiometricsSettings = () => {
  return useQuery({
    staleTime: Infinity,
    queryKey: authKeys.biometrics,
    queryFn: () => getBiometricsSettings(),
    meta: {
      errorName: 'getBiometricsSettings: Service error',
    },
  })
}
