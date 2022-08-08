import { EnvironmentTypesConstants } from 'constants/common'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { ENVIRONMENT } = getEnv()

const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production

type FeatureFlipperType = 'testFeature'

export type RemoteConfigValues = {
  testFeature: boolean
}

const devDefaults: RemoteConfigValues = {
  testFeature: true,
}

const productionDefaults: RemoteConfigValues = {
  testFeature: false,
}

export const activateRemoteConfig = async (): Promise<void> => {
  /**
   * If in production, fetch and activate remote settings.  Otherwise,
   * we'll use the devDefaults for dev and staging defined above.
   */
  if (isProduction) {
    console.debug('Remote Config: Settigns defaults')
    // Sets defaults for remote config for use prior to fetching and activating
    await remoteConfig().setDefaults(productionDefaults)

    console.debug('Remote Config: Fetching and activating')
    // Fetch config and activate. Default cache is 12 hours.
    await remoteConfig().fetchAndActivate()
  }
}

export const featureEnabled = (feature: FeatureFlipperType): boolean => {
  return isProduction ? remoteConfig().getValue(feature)?.asBoolean() : devDefaults[feature]
}
