import { Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getBuildNumber, getVersionName } from 'utils/deviceData'
import { isIOS } from 'utils/platform'
import { requestStoreVersion } from 'utils/rnInAppUpdate'
import getEnv from 'utils/env'

const APP_VERSION_SKIPPED_UPDATE_VAL = '@store_app_version_skipped'
const APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL = '@store_app_whats_new_version_skipped'
const APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL = '@store_app_version_encourage_update_local_override'
const APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL = '@store_app_version_whats_new_local_override'
const { APPLE_STORE_LINK } = getEnv()

/**
 * returns version skipped for what's new
 */
export const getWhatsNewVersionSkipped = async (): Promise<string> => {
  const reconstructedToken = (await AsyncStorage.getItem(APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL)) || '0.0.0'
  return reconstructedToken
}

export const getWhatsNewLocalVersion = async (demoMode: boolean): Promise<string> => {
  const localOverride = await AsyncStorage.getItem(APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL)
  if (demoMode && localOverride) {
    return localOverride
  } else {
    const version = await getVersionName()
    if (isIOS()) {
      return version
    } else {
      return version + '.'
    }
  }
}

/**
 * stores version skipped for what's new
 */
export const setWhatsNewVersionSkipped = async (versionSkipped: string): Promise<void> => {
  await AsyncStorage.setItem(APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL, versionSkipped)
}
/**
 *
 * returns local version, version name for iOS and buildnumber for Android.
 * This is due to how the app store returns the version vs the google play store api
 */
export const getEncourageUpdateLocalVersion = async (demoMode: boolean): Promise<string> => {
  const localOverride = await AsyncStorage.getItem(APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL)
  if (demoMode && localOverride) {
    return localOverride
  } else if (isIOS()) {
    return await getVersionName()
  } else {
    const version = await getBuildNumber()
    return version.toString()
  }
}
/**
 *
 * Returns the store version, minimumOsVersion and Supported Devices in the same string for iOS. For Android it returns the build number.
 * This is due to how the stores operate.
 */

export const getStoreVersion = async (): Promise<string> => {
  const result = await requestStoreVersion()
  if (isIOS()) {
    // includes minimumOsVersion and supported devices
    const parsedString = result.split(', ')
    const version = parsedString[0] + '.'
    return version
  } else {
    return result.toString()
  }
}
/**
 * returns version skipped for encouraged update
 */
export const getVersionSkipped = async (): Promise<string> => {
  const result = await Promise.all([AsyncStorage.getItem(APP_VERSION_SKIPPED_UPDATE_VAL)])
  const reconstructedToken = result[0] ? `${result[0]}` : '0.0.0'
  return reconstructedToken
}

/**
 * stores version skipped for encouraged update
 */
export const setVersionSkipped = async (versionSkipped: string): Promise<void> => {
  await Promise.all([AsyncStorage.setItem(APP_VERSION_SKIPPED_UPDATE_VAL, versionSkipped)])
}

export const overrideEncourageUpdateLocalVersion = async (overrideVersion: string | undefined): Promise<void> => {
  if (overrideVersion) {
    await Promise.all([AsyncStorage.setItem(APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL, overrideVersion)])
  } else {
    await Promise.all([AsyncStorage.removeItem(APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL)])
  }
}

export const overrideWhatsNewLocalVersion = async (overrideVersion: string | undefined): Promise<void> => {
  if (overrideVersion) {
    await Promise.all([AsyncStorage.setItem(APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL, overrideVersion)])
  } else {
    await Promise.all([AsyncStorage.removeItem(APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL)])
  }
}

/**
 * opens the Apple Store when they confirm they want to update the app
 */

export const openAppStore = () => {
  const link = APPLE_STORE_LINK
  Linking.canOpenURL(link).then(
    (supported) => {
      supported && Linking.openURL(link)
    },
    (err) => console.log(err),
  )
}
