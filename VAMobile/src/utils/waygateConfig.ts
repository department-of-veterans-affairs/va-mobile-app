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
  // Whether to deny access all together to
  denyAccess?: boolean
}

export type WaygateToggleType =
  | 'WG_Home'
  | 'WG_Profile'
  | 'WG_PersonalInformation'
  | 'WG_HowDoIUpdate'
  | 'WG_PreferredName'
  | 'WG_GenderIdentity'
  | 'WG_WhatToKnow'
  | 'WG_ContactInformation'
  | 'WG_HowWillYou'
  | 'WG_EditAddress'
  | 'WG_EditPhoneNumber'
  | 'WG_EditEmail'
  | 'WG_MilitaryInformation'
  | 'WG_IncorrectServiceInfo'
  | 'WG_Settings'
  | 'WG_ManageYourAccount'
  | 'WG_NotificationsSettings'
  | 'WG_ContactVA'
  | 'WG_VeteransCrisisLine'
  | 'WG_VeteranStatus'
  | 'WG_Login'
  | 'WG_RemoteConfig'
  | 'WG_Developer'
  | 'WG_WaygateEdit'

type WaygateToggleValues = {
  WG_Home: Waygate
  WG_Profile: Waygate
  WG_PersonalInformation: Waygate
  WG_HowDoIUpdate: Waygate
  WG_PreferredName: Waygate
  WG_GenderIdentity: Waygate
  WG_WhatToKnow: Waygate
  WG_ContactInformation: Waygate
  WG_HowWillYou: Waygate
  WG_EditAddress: Waygate
  WG_EditPhoneNumber: Waygate
  WG_EditEmail: Waygate
  WG_MilitaryInformation: Waygate
  WG_IncorrectServiceInfo: Waygate
  WG_Settings: Waygate
  WG_ManageYourAccount: Waygate
  WG_NotificationsSettings: Waygate
  WG_ContactVA: Waygate
  WG_VeteransCrisisLine: Waygate
  WG_VeteranStatus: Waygate
  WG_Login: Waygate
  WG_RemoteConfig: Waygate
  WG_Developer: Waygate
  WG_WaygateEdit: Waygate
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
  WG_Home: { ...waygateDefault },
  WG_Profile: { ...waygateDefault },
  WG_PersonalInformation: { ...waygateDefault },
  WG_HowDoIUpdate: { ...waygateDefault },
  WG_PreferredName: { ...waygateDefault },
  WG_GenderIdentity: { ...waygateDefault },
  WG_WhatToKnow: { ...waygateDefault },
  WG_ContactInformation: { ...waygateDefault },
  WG_HowWillYou: { ...waygateDefault },
  WG_EditAddress: { ...waygateDefault },
  WG_EditPhoneNumber: { ...waygateDefault },
  WG_EditEmail: { ...waygateDefault },
  WG_MilitaryInformation: { ...waygateDefault },
  WG_IncorrectServiceInfo: { ...waygateDefault },
  WG_Settings: { ...waygateDefault },
  WG_ManageYourAccount: { ...waygateDefault },
  WG_NotificationsSettings: { ...waygateDefault },
  WG_ContactVA: { ...waygateDefault },
  WG_VeteransCrisisLine: { ...waygateDefault },
  WG_VeteranStatus: { ...waygateDefault },
  WG_Login: { ...waygateDefault },
  WG_RemoteConfig: { ...waygateDefault },
  WG_Developer: { ...waygateDefault },
  WG_WaygateEdit: { ...waygateDefault },
}

export const waygateEnabled = (feature: WaygateToggleType): Waygate => {
  console.log('overrideRemote is: ' + overrideRemote)
  console.log('waygate is: ' + feature)
  if (overrideRemote) {
    return waygateConfig[feature] ? waygateConfig[feature] : { ...waygateDefault }
  } else {
    const waygate = remoteConfig().getValue(feature)?.asString()
    if (waygate) {
      return JSON.parse(waygate) as Waygate
    } else {
      return { ...waygateDefault }
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

/**
 *
 * @param feature-this is the waygateName that we are checking for
 * @returns false when a waygateNativeAlert is displayed and denies continued navigation
 */
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
