import { logNonFatalErrorToFirebase } from './analytics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { IS_TEST } = getEnv()

const fetchRemote = !__DEV__ && !IS_TEST
const RC_FETCH_TIMEOUT = 10000 // 10 sec
const RC_CACHE_TIME = 30 * 60 * 1000 // 30 min
const REMOTE_CONFIG_OVERRIDES_KEY = '@store_remote_config_overrides'

export let overrideRemote = false

/* Valid feature toggles.  Should match firebase */
export type FeatureToggleType =
  | 'appointmentRequests'
  | 'prescriptions'
  | 'SIS'
  | 'testFeature'
  | 'inAppUpdates'
  | 'preferredNameGenderWaygate'
  | 'haptics'
  | 'whatsNewUI'
  | 'decisionLettersWaygate'
  | 'patientCheckIn'
  | 'patientCheckInWaygate'

type FeatureToggleValues = {
  appointmentRequests: boolean
  prescriptions: boolean
  SIS: boolean
  testFeature: boolean
  inAppUpdates: boolean
  preferredNameGenderWaygate: boolean
  haptics: boolean
  whatsNewUI: boolean
  decisionLettersWaygate: boolean
  patientCheckIn: boolean
  patientCheckInWaygate: boolean
}

export let devConfig: FeatureToggleValues = {
  appointmentRequests: true,
  prescriptions: true,
  SIS: true,
  testFeature: true,
  inAppUpdates: true,
  preferredNameGenderWaygate: true,
  haptics: true,
  whatsNewUI: true,
  decisionLettersWaygate: true,
  patientCheckIn: false,
  patientCheckInWaygate: true,
}

export const productionDefaults: FeatureToggleValues = {
  appointmentRequests: false,
  prescriptions: true,
  SIS: true,
  testFeature: false,
  inAppUpdates: false,
  preferredNameGenderWaygate: true,
  haptics: true,
  whatsNewUI: true,
  decisionLettersWaygate: true,
  patientCheckIn: false,
  patientCheckInWaygate: true,
}

/**
 * Sets up Remote Config, sets defaults, fetches and activates config from firebase
 * @returns Promise<void>
 */
export const activateRemoteConfig = async (): Promise<void> => {
  try {
    // Sets timeout for remote config fetch
    await remoteConfig().setConfigSettings({ fetchTimeMillis: RC_FETCH_TIMEOUT })
    console.debug(`Remote Config: Set fetch timeout to ${RC_FETCH_TIMEOUT / 1000} seconds`)

    console.debug('Remote Config: Setting defaults')
    // Sets defaults for remote config for use prior to fetching and activating
    const defaults = fetchRemote ? productionDefaults : devConfig
    await remoteConfig().setDefaults(defaults)
    console.debug('Remote Config: Defaults set', defaults)

    /**
     * If in staging or production, fetch and activate remote settings.  Otherwise,
     * we'll use the devConfig for local development.
     */
    if (fetchRemote) {
      console.debug('Remote Config: Fetching and activating')
      await remoteConfig().fetch(RC_CACHE_TIME)
      console.debug('Remote Config: Fetched latest remote config')
      await remoteConfig().activate()
      console.debug('Remote Config: Activated config')
    }

    await loadOverrides()
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'activateRemoteConfig: Firebase Remote Config Error')
    console.debug('activateRemoteConfig: Failed to activate remote config')
    console.error(err)
    return undefined
  }
}

/**
 * Checks if we have any feature toggle overrides stored in AsyncStorage and loads them if so
 */
export const loadOverrides = async (): Promise<void> => {
  try {
    const overrides = await AsyncStorage.getItem(REMOTE_CONFIG_OVERRIDES_KEY)
    if (overrides) {
      console.debug('Remote Config: Found overrides in AsyncStorage. Applying')
      overrideRemote = true
      devConfig = JSON.parse(overrides) as FeatureToggleValues
    } else {
      console.debug('Remote Config: No overrides found in AsyncStorage')
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
    console.debug('loadOverrides: Failed to load overrides from AsyncStorage')
  }
}

/**
 * @param feature - FeatureToggleType: The name of the feature we want to check the value of
 * @returns boolean of whether or not the feature is enabled.  If we're overriding the config in debug mode,
 * we'll return the value of the key in devConfig, otherwise we return the remoteConfig value
 */
export const featureEnabled = (feature: FeatureToggleType): boolean => {
  return overrideRemote ? devConfig[feature] : remoteConfig().getValue(feature)?.asBoolean()
}

/**
 * Sets overrideRemote to true with the values passed. The app will use these overrides instead of fetched config or productionDefaults
 * NOTE: This should ONLY ever be invoked from within of our developer settings UI
 * @param config - An object of FeatureToggleValues type that contains the config we want to override our remote config with
 */
export const setDebugConfig = async (config: FeatureToggleValues): Promise<void> => {
  overrideRemote = true
  devConfig = config

  // Store overrides in AsyncStorage so they persist with app quits
  AsyncStorage.setItem(REMOTE_CONFIG_OVERRIDES_KEY, JSON.stringify(config))
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
