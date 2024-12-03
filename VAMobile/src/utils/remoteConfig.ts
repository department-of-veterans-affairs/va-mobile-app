import AsyncStorage from '@react-native-async-storage/async-storage'
import remoteConfig from '@react-native-firebase/remote-config'

import getEnv from 'utils/env'
import { loadWaygateOverrides } from 'utils/waygateConfig'

import { logNonFatalErrorToFirebase } from './analytics'

const { IS_TEST } = getEnv()

const fetchRemote = !__DEV__ && !IS_TEST
const RC_FETCH_TIMEOUT = 10000 // 10 sec
const RC_CACHE_TIME = 1800 // 30 min
const REMOTE_CONFIG_OVERRIDES_KEY = '@store_remote_config_overrides'
export let overrideRemote = false

/* Valid feature toggles.  Should match firebase */
export type FeatureToggleType =
  | 'appointmentRequests'
  | 'cernerTrueForDemo'
  | 'decisionLettersWaygate'
  | 'haptics'
  | 'homeScreenPrefetch'
  | 'inAppRecruitment'
  | 'inAppReview'
  | 'inAppUpdates'
  | 'patientCheckIn'
  | 'patientCheckInWaygate'
  | 'preferredNameGenderWaygate'
  | 'prescriptions'
  | 'submitEvidenceExpansion'
  | 'sso'
  | 'testFeature'
  | 'useOldLinkComponent'
  | 'whatsNewUI'

type FeatureToggleValues = {
  appointmentRequests: boolean
  cernerTrueForDemo: boolean
  decisionLettersWaygate: boolean
  haptics: boolean
  homeScreenPrefetch: boolean
  inAppRecruitment: boolean
  inAppReview: boolean
  inAppUpdates: boolean
  patientCheckIn: boolean
  patientCheckInWaygate: boolean
  preferredNameGenderWaygate: boolean
  prescriptions: boolean
  submitEvidenceExpansion: boolean
  sso: boolean
  testFeature: boolean
  useOldLinkComponent: boolean
  whatsNewUI: boolean
}

export const defaults: FeatureToggleValues = {
  appointmentRequests: false,
  cernerTrueForDemo: false,
  decisionLettersWaygate: true,
  haptics: true,
  homeScreenPrefetch: true,
  inAppRecruitment: false,
  inAppReview: true,
  inAppUpdates: true,
  patientCheckIn: false,
  patientCheckInWaygate: true,
  preferredNameGenderWaygate: true,
  prescriptions: true,
  submitEvidenceExpansion: false,
  sso: false,
  testFeature: false,
  useOldLinkComponent: true,
  whatsNewUI: true,
}

export let devConfig: FeatureToggleValues = defaults

/**
 * Sets up Remote Config, sets defaults, fetches and activates config from firebase
 * @returns Promise<void>
 */
export const activateRemoteConfig = async (): Promise<void> => {
  try {
    // Sets timeout for remote config fetch
    await remoteConfig().setConfigSettings({ fetchTimeMillis: RC_FETCH_TIMEOUT })
    // Sets defaults for remote config for use prior to fetching and activating
    await remoteConfig().setDefaults(defaults)
    console.debug('Remote Config: Defaults set', defaults)

    /**
     * If in staging or production, fetch and activate remote settings.  Otherwise,
     * we'll use the devConfig for local development.
     */
    if (fetchRemote) {
      console.debug('Remote Config: Fetching and activating')
      await remoteConfig().fetch(RC_CACHE_TIME)
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

export const setOverrideRemote = (setOverride: boolean) => {
  overrideRemote = setOverride
}

/**
 * Checks if we have any feature toggle overrides stored in AsyncStorage and loads them if so
 */
export const loadOverrides = async (): Promise<void> => {
  try {
    overrideRemote = false
    await loadWaygateOverrides()
    const overrides = await AsyncStorage.getItem(REMOTE_CONFIG_OVERRIDES_KEY)
    if (overrides) {
      overrideRemote = true
      devConfig = JSON.parse(overrides) as FeatureToggleValues
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
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
 * Sets overrideRemote to true with the values passed. The app will use these overrides instead of fetched config or defaults
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
    if (!key.startsWith('WG')) {
      toggles[key as FeatureToggleType] = remoteConfig().getValue(key).asBoolean()
    }
  })
  return toggles
}
