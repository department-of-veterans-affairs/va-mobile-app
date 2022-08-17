import { EnvironmentTypesConstants } from 'constants/common'
import { logNonFatalErrorToFirebase } from './analytics'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { ENVIRONMENT } = getEnv()

const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production
const RC_CACHE_TIME = 43200000 // 12 hours

type FeatureToggleType = 'testFeature' | 'SIS'

export type RemoteConfigValues = {
  testFeature: boolean
  SIS: boolean
}

const devDefaults: RemoteConfigValues = {
  testFeature: true,
  SIS: false,
}

const productionDefaults: RemoteConfigValues = {
  testFeature: false,
  SIS: false,
}

/**
 * Sets up Remote Config, setting defaults, activating them, and fetching the config for next app launch
 * following Strategy 3 https://firebase.google.com/docs/remote-config/loading#strategy_3_load_new_values_for_next_startup
 * @returns Promise<void>
 */
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
      // Activate last fetched config then fetch latest config for use on next app launch
      await remoteConfig().activate()
      console.debug('Remote Config: Activated last fetched config')
      await remoteConfig().fetch(RC_CACHE_TIME)
      console.debug('Remote Config: Fetched latest remote config')
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
