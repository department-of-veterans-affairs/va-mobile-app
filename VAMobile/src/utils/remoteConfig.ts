import { Alert } from 'react-native'
import { logNonFatalErrorToFirebase } from './analytics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEnv from 'utils/env'
import remoteConfig from '@react-native-firebase/remote-config'

const { IS_TEST } = getEnv()

const fetchRemote = !__DEV__ && !IS_TEST
const RC_FETCH_TIMEOUT = 10000 // 10 sec
const RC_CACHE_TIME = 30 * 60 * 1000 // 30 min
const REMOTE_CONFIG_OVERRIDES_KEY = '@store_remote_config_overrides'
const WAYGATE_OVERRIDES_KEY = '@store_waygate_overrides'

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

export const productionDefaults: FeatureToggleValues = {
  appointmentRequests: false,
  prescriptions: true,
  SIS: true,
  testFeature: false,
  inAppUpdates: true,
  preferredNameGenderWaygate: true,
  haptics: true,
  whatsNewUI: true,
  decisionLettersWaygate: true,
  patientCheckIn: false,
  patientCheckInWaygate: true,
}

export let devConfig: FeatureToggleValues = productionDefaults

export type Waygate = {
  // true means waygate is 'open' so no waygate display, false will display waygate.
  enabled: boolean
  // Title for Alertbox
  errorMsgTitle?: string
  // Body for Alertbox
  errorMsgBody?: string
  // Whether to display the app update button
  appUpdateButton?: boolean
  // Whether to announce but not hinder access
  allowFunction?: boolean
  // Whether to deny access all together to screen
  denyAccess?: boolean
}

export type WaygateToggleType =
  | 'WG_HomeScreen'
  | 'WG_ProfileScreen'
  | 'WG_PersonalInformationScreen'
  | 'WG_HowDoIUpdateScreen'
  | 'WG_PreferredNameScreen'
  | 'WG_GenderIdentityScreen'
  | 'WG_WhatToKnowScreen'
  | 'WG_ContactInformationScreen'
  | 'WG_HowWillYouScreen'
  | 'WG_EditAddressScreen'
  | 'WG_EditPhoneNumberScreen'
  | 'WG_EditEmailScreen'
  | 'WG_MilitaryInformationScreen'
  | 'WG_IncorrectServiceInfoScreen'
  | 'WG_SettingsScreen'
  | 'WG_ManageYourAccountScreen'
  | 'WG_NotificationsSettingsScreen'
  | 'WG_ContactVAScreen'

type WaygateToggleValues = {
  WG_HomeScreen: Waygate
  WG_ProfileScreen: Waygate
  WG_PersonalInformationScreen: Waygate
  WG_HowDoIUpdateScreen: Waygate
  WG_PreferredNameScreen: Waygate
  WG_GenderIdentityScreen: Waygate
  WG_WhatToKnowScreen: Waygate
  WG_ContactInformationScreen: Waygate
  WG_HowWillYouScreen: Waygate
  WG_EditAddressScreen: Waygate
  WG_EditPhoneNumberScreen: Waygate
  WG_EditEmailScreen: Waygate
  WG_MilitaryInformationScreen: Waygate
  // TODO: Should we add 'missing information' type blockers? NoMilitaryInfoScreen?
  WG_IncorrectServiceInfoScreen: Waygate
  WG_SettingsScreen: Waygate
  WG_ManageYourAccountScreen: Waygate
  WG_NotificationsSettingsScreen: Waygate
  WG_ContactVAScreen: Waygate
}

export let waygateConfig: WaygateToggleValues = {
  WG_HomeScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ProfileScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_PersonalInformationScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_HowDoIUpdateScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_PreferredNameScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_GenderIdentityScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_WhatToKnowScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ContactInformationScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_HowWillYouScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_EditAddressScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_EditPhoneNumberScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_EditEmailScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_MilitaryInformationScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_IncorrectServiceInfoScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_SettingsScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ManageYourAccountScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_NotificationsSettingsScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ContactVAScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
}

/**
 * Sets up Remote Config, sets defaults, fetches and activates config from firebase
 * @returns Promise<void>
 */
export const activateRemoteConfig = async (): Promise<void> => {
  try {
    // Sets timeout for remote config fetch
    await remoteConfig().setConfigSettings({ fetchTimeMillis: RC_FETCH_TIMEOUT })
    // Sets defaults for remote config for use prior to fetching and activating
    await remoteConfig().setDefaults(productionDefaults)
    console.debug('Remote Config: Defaults set', productionDefaults)

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
    await loadWaygateOverrides()
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
      devConfig = JSON.parse(overrides) as FeatureToggleValues
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
  }
}

export const loadWaygateOverrides = async (): Promise<void> => {
  try {
    const overrides = await AsyncStorage.getItem(WAYGATE_OVERRIDES_KEY)
    if (overrides) {
      waygateConfig = JSON.parse(overrides)
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'loadWaygateOverrides: AsyncStorage error')
  }
}

/**
 * @param feature - FeatureToggleType: The name of the feature we want to check the value of
 * @returns boolean of whether or not the feature is enabled.  If we're overriding the config in debug mode,
 * we'll return the value of the key in devConfig, otherwise we return the remoteConfig value
 */
export const featureEnabled = (feature: FeatureToggleType): boolean => {
  return !fetchRemote ? devConfig[feature] : remoteConfig().getValue(feature)?.asBoolean()
}

export const waygateEnabled = (feature: WaygateToggleType): Waygate => {
  return !fetchRemote ? waygateConfig[feature] : (remoteConfig().getValue(feature) as unknown as Waygate)
}

export const waygateNativeAlert = (feature: WaygateToggleType): boolean => {
  const waygate = waygateEnabled(feature)
  if (waygate.enabled === false && waygate.denyAccess === true && waygate.errorMsgTitle) {
    Alert.alert(waygate.errorMsgTitle, waygate.errorMsgBody, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ])
    return false
  }
  return true
}

/**
 * Sets overrideRemote to true with the values passed. The app will use these overrides instead of fetched config or productionDefaults
 * NOTE: This should ONLY ever be invoked from within of our developer settings UI
 * @param config - An object of FeatureToggleValues type that contains the config we want to override our remote config with
 */
export const setDebugConfig = async (config: FeatureToggleValues): Promise<void> => {
  devConfig = config

  // Store overrides in AsyncStorage so they persist with app quits
  AsyncStorage.setItem(REMOTE_CONFIG_OVERRIDES_KEY, JSON.stringify(config))
}

/**
 * @returns FeatureToggleValues - Returns an object with all feature toggles and their values.  If we're overriding remote config, we'll return
 * devConfig. Otherwise we'll return the values from remoteConfig()
 */
export const getFeatureToggles = (): FeatureToggleValues => {
  if (!fetchRemote) {
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

export const getWaygateToggles = (): WaygateToggleValues => {
  if (!fetchRemote) {
    return waygateConfig
  }

  const toggles = {} as WaygateToggleValues
  Object.keys(remoteConfig().getAll()).forEach((key) => {
    if (key.startsWith('WG')) {
      toggles[key as WaygateToggleType] = remoteConfig().getValue(key) as unknown as Waygate
    }
  })
  return toggles
}
