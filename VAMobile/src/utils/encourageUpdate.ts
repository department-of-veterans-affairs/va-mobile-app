import { Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getBuildNumber, getVersionName } from 'utils/deviceData'
import { isIOS } from 'utils/platform'
import { requestStoreVersion } from 'utils/rnInAppUpdate'
import getEnv from 'utils/env'

const APP_VERSION_SKIPPED_UPDATE_VAL = '@store_app_version_skipped'
const { APPLE_STORE_LINK } = getEnv()

/**
 *
 * returns local version, version name for iOS and buildnumber for Android.
 * This is due to how the app store returns the version vs the google play store api
 */
export const getEncourageUpdateLocalVersion = async (): Promise<string> => {
  if (isIOS()) {
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
