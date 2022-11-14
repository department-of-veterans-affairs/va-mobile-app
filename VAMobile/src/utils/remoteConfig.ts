import { EnvironmentTypesConstants } from 'constants/common'
import { logNonFatalErrorToFirebase } from './analytics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { ENVIRONMENT, IS_TEST } = getEnv()

const fetchRemote = !__DEV__ && !IS_TEST
const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production
const RC_CACHE_TIME = 43200000 // 12 hours
const REMOTE_CONFIG_OVERRIDES_KEY = '@store_remote_config_overrides'

export let overrideRemote = false

/* Valid feature toggles.  Should match firebase */
export type FeatureToggleType = 'appointmentRequests' | 'prescriptions' | 'SIS' | 'testFeature'

type FeatureToggleValues = {
  appointmentRequests: boolean
  prescriptions: boolean
  SIS: boolean
  testFeature: boolean
}

let devConfig: FeatureToggleValues = {
  appointmentRequests: true,
  prescriptions: true,
  SIS: true,
  testFeature: true,
}

const productionDefaults: FeatureToggleValues = {
  appointmentRequests: false,
  prescriptions: false,
  SIS: false,
  testFeature: false,
}

/**
 * Sets up Remote Config, setting defaults, activating them, and fetching the config for next app launch
 * following Strategy 3 https://firebase.google.com/docs/remote-config/loading#strategy_3_load_new_values_for_next_startup
 * @returns Promise<void>
 */
export const activateRemoteConfig = async (): Promise<void> => {
  try {
    /**
     * If in staging or production, fetch and activate remote settings.  Otherwise,
     * we'll use the devConfig for local development.
     */
    if (fetchRemote) {
      console.debug('Remote Config: Setting defaults')
      // Sets defaults for remote config for use prior to fetching and activating
      await remoteConfig().setDefaults(productionDefaults)
      console.debug('Remote Config: Fetching and activating')
      // Activate last fetched config then fetch latest config for use on next app launch
      await remoteConfig().activate()
      console.debug('Remote Config: Activated last fetched config')
      await remoteConfig().fetch(RC_CACHE_TIME)
      console.debug('Remote Config: Fetched latest remote config')
    } else {
      console.debug('Remote Config: Setting defaults')
      // Check if we have any overrides stored in AsyncStorage, otherwise use devConfig
      const overrides = await AsyncStorage.getItem(REMOTE_CONFIG_OVERRIDES_KEY)
      let config
      if (overrides) {
        console.debug('Remote Config: Found overrides in AsyncStorage. Applying')
        config = JSON.parse(overrides)
        overrideRemote = true
      } else {
        console.debug('Remote Config: No overrides found in AsyncStorage. Applying dev defaults')
        config = devConfig
      }
      await remoteConfig().setDefaults(config)
      console.debug('Remote Config: Defaults set', config)
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'activateRemoteConfig: Firebase Remote Config Error')
    console.debug('activateRemoteConfig: Failed to activate remote config')
    console.error(err)
    return undefined
  }
}

/**
 * @param feature - FeatureToggleType: The name of the feature we want to check the value of
 * @returns boolean of whether or not the feature is enabled.  If we're overriding the config in debug mode,
 * we'll return the value of the key in devConfig, otherwise we return the remoteConfig value
 */
export const featureEnabled = (feature: FeatureToggleType): boolean => {
  return !isProduction && overrideRemote ? devConfig[feature] : remoteConfig().getValue(feature)?.asBoolean()
}

export const setDebugConfig = async (config: FeatureToggleValues): Promise<void> => {
  if (!isProduction) {
    overrideRemote = true
    devConfig = config

    // Store overrides in AsyncStorage so they persist with app quits
    AsyncStorage.setItem(REMOTE_CONFIG_OVERRIDES_KEY, JSON.stringify(config))
  }
}

/**
 * @returns FeatureToggleValues - Returns an object with all feature toggles and their values.  If we're overriding remote config, we'll return
 * devConfig. Otherwise we'll return the values from remoteConfig()
 */
export const getFeatureToggles = (): FeatureToggleValues => {
  if (overrideRemote) {
    return devConfig
  }

  const toggles = {} as FeatureToggleValues
  Object.keys(remoteConfig().getAll()).forEach((key) => {
    toggles[key as FeatureToggleType] = remoteConfig().getValue(key).asBoolean()
  })
  return toggles
}
