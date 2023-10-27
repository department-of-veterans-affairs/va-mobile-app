import { Alert } from 'react-native'
import { logNonFatalErrorToFirebase } from './analytics'
import { overrideRemote, setOverrideRemote } from './remoteConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import remoteConfig from '@react-native-firebase/remote-config'
const WAYGATE_OVERRIDES_KEY = '@store_waygate_overrides'

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
  | 'WG_VeteransCrisisLineScreen'
  | 'WG_VeteranStatusScreen'
  | 'WG_LoginScreen'

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
  WG_IncorrectServiceInfoScreen: Waygate
  WG_SettingsScreen: Waygate
  WG_ManageYourAccountScreen: Waygate
  WG_NotificationsSettingsScreen: Waygate
  WG_ContactVAScreen: Waygate
  WG_VeteransCrisisLineScreen: Waygate
  WG_VeteranStatusScreen: Waygate
  WG_LoginScreen: Waygate
}

const waygateDefault: Waygate = {
  enabled: true,
  errorMsgTitle: undefined,
  errorMsgBody: undefined,
  appUpdateButton: false,
  allowFunction: false,
  denyAccess: false,
}

export let waygateConfig: WaygateToggleValues = {
  WG_HomeScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_ProfileScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_PersonalInformationScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_HowDoIUpdateScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_PreferredNameScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_GenderIdentityScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_WhatToKnowScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_ContactInformationScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_HowWillYouScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_EditAddressScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_EditPhoneNumberScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_EditEmailScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_MilitaryInformationScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_IncorrectServiceInfoScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_SettingsScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_ManageYourAccountScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_NotificationsSettingsScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_ContactVAScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_VeteransCrisisLineScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_VeteranStatusScreen: JSON.parse(JSON.stringify(waygateDefault)),
  WG_LoginScreen: JSON.parse(JSON.stringify(waygateDefault)),
}

export const waygateEnabled = (feature: WaygateToggleType): Waygate => {
  if (overrideRemote) {
    return waygateConfig[feature]
  } else {
    const waygate = remoteConfig().getValue(feature)?.asString()
    if (waygate) {
      return JSON.parse(waygate) as Waygate
    } else {
      return {
        enabled: true,
        errorMsgTitle: undefined,
        errorMsgBody: undefined,
        appUpdateButton: false,
        allowFunction: false,
        denyAccess: false,
      }
    }
  }
}

export const loadWaygateOverrides = async (): Promise<void> => {
  try {
    const waygateOverrides = await AsyncStorage.getItem(WAYGATE_OVERRIDES_KEY)
    if (waygateOverrides) {
      setOverrideRemote(true)
      waygateConfig = JSON.parse(waygateOverrides) as WaygateToggleValues
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
  }
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

export const setWaygateDebugConfig = async (config: WaygateToggleValues): Promise<void> => {
  setOverrideRemote(true)
  waygateConfig = config

  // Store overrides in AsyncStorage so they persist with app quits
  AsyncStorage.setItem(WAYGATE_OVERRIDES_KEY, JSON.stringify(config))
}

export const getWaygateToggles = (): WaygateToggleValues => {
  if (overrideRemote) {
    return waygateConfig
  }

  //this just initializes the waygate list without having to first create them all in firebase.
  const toggles = waygateConfig
  Object.keys(remoteConfig().getAll()).forEach((key) => {
    if (key.startsWith('WG')) {
      toggles[key as WaygateToggleType] = JSON.parse(remoteConfig().getValue(key).asString()) as unknown as Waygate
    }
  })
  return toggles
}
