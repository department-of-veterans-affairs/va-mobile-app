import { EnvironmentTypesConstants } from 'constants/common'
import { logNonFatalErrorToFirebase } from './analytics'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { ENVIRONMENT } = getEnv()

const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production

type FeatureToggleType = 'testFeature'

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
  try {
    console.debug('Remote Config: Setting defaults')
    // Sets defaults for remote config for use prior to fetching and activating
    await remoteConfig().setDefaults(isProduction ? productionDefaults : devDefaults)

    /**
     * If in production, fetch and activate remote settings.  Otherwise,
     * we'll use the devDefaults for dev and staging defined above.
     */
    if (isProduction) {
      console.debug('Remote Config: Fetching and activating')
      // Fetch config and activate. Default cache is 12 hours.
      await remoteConfig().fetchAndActivate()
      console.debug('Remote Config: Fetched and activated')
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'activateRemoteConfig: Firebase Remote Config Error')
    console.debug('activateRemoteConfig: Failed to activate remote config')
    console.error(err)
    return undefined
  }
}

export const featureEnabled = (feature: FeatureToggleType): boolean => {
  return remoteConfig().getValue(feature)?.asBoolean()
}
