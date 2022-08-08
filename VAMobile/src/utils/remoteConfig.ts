import { EnvironmentTypesConstants } from 'constants/common'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { ENVIRONMENT } = getEnv()

const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production

type FeatureFlipperType = 'testFeature'

export type RemoteConfigValues = {
  testFeature: boolean
}

export const FeatureFlipperConstants: {
  testFeature: string
} = {
  testFeature: 'testFeature',
}

const defaults: RemoteConfigValues = {
  testFeature: false,
}

const devDefaults: RemoteConfigValues = {
  testFeature: true,
}

export const activateRemoteConfig = async (): Promise<void> => {
  console.debug('Remote Config: Setting defaults')
  await remoteConfig().setDefaults(isProduction ? defaults : devDefaults)

  /**
   * If in production, fetch and activate remote settings.  Otherwise,
   * we'll use the devDefaults for dev and staging defined above.
   */
  if (isProduction) {
    console.debug('Remote Config: Fetching and activating')
    // Fetch config and activate. Default cache is 12 hours
    await remoteConfig().fetchAndActivate()
  }
}

export const featureEnabled = (feature: FeatureFlipperType): boolean => remoteConfig().getValue(feature)?.asBoolean()
