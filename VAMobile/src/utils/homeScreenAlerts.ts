import AsyncStorage from '@react-native-async-storage/async-storage'

import { find } from 'underscore'

import { getWhatsNewConfig } from 'components'
import { getBuildNumber, getVersionName } from 'utils/deviceData'
import { isIOS } from 'utils/platform'
import { requestStoreVersion } from 'utils/rnInAppUpdate'

const APP_VERSION_SKIPPED_UPDATE_VAL = '@store_app_version_skipped'
export const APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL = '@store_app_whats_new_version_skipped'
const APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL = '@store_app_version_encourage_update_local_override'
export const APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL = '@store_app_version_whats_new_local_override'
export const APP_FEATURES_WHATS_NEW_SKIPPED_VAL = '@store_app_features_whats_new_skipped'

export const FeatureConstants: {
  ENCOURAGEUPDATE: number
  WHATSNEW: number
} = {
  ENCOURAGEUPDATE: 0,
  WHATSNEW: 1,
}

/**
 * returns version skipped for particular feature
 */
export const getVersionSkipped = async (feature: number): Promise<string> => {
  switch (feature) {
    case FeatureConstants.WHATSNEW:
      return (await AsyncStorage.getItem(APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL)) || '0.0'
    case FeatureConstants.ENCOURAGEUPDATE:
      return (await AsyncStorage.getItem(APP_VERSION_SKIPPED_UPDATE_VAL)) || '0.0'
  }
  return '0.0'
}

/**
 * stores version skipped for particular feature
 */
export const setVersionSkipped = async (feature: number, versionSkipped: string): Promise<void> => {
  switch (feature) {
    case FeatureConstants.WHATSNEW:
      await AsyncStorage.setItem(APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL, versionSkipped)
      break
    case FeatureConstants.ENCOURAGEUPDATE:
      await AsyncStorage.setItem(APP_VERSION_SKIPPED_UPDATE_VAL, versionSkipped)
      break
  }
}

export const getFeaturesSkipped = async () => {
  const currentSkipsStr = await AsyncStorage.getItem(APP_FEATURES_WHATS_NEW_SKIPPED_VAL)
  let featureSkips: string[] = []

  if (currentSkipsStr) {
    featureSkips = JSON.parse(currentSkipsStr)
  }

  return featureSkips
}

export const setFeaturesSkipped = async (features: string[]) => {
  if (!features.length) {
    return
  }

  let featureSkips = await getFeaturesSkipped()
  featureSkips = featureSkips.concat(features)

  const whatsNewItems = getWhatsNewConfig()
  const currentFeatureSkips: string[] = []
  featureSkips.forEach((featureSkip) => {
    // If the skipped feature does not currently belong in the what's new config than do not include it in the skip list
    if (find(whatsNewItems, (item) => item.featureName === featureSkip)) {
      currentFeatureSkips.push(featureSkip)
    }
  })

  await AsyncStorage.setItem(APP_FEATURES_WHATS_NEW_SKIPPED_VAL, JSON.stringify(currentFeatureSkips))
}

/**
 * override local version for particular feature
 */
export const overrideLocalVersion = async (feature: number, overrideVersion: string | undefined): Promise<void> => {
  switch (feature) {
    case FeatureConstants.WHATSNEW:
      if (overrideVersion) {
        await AsyncStorage.setItem(APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL, overrideVersion)
      } else {
        await AsyncStorage.removeItem(APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL)
      }
      break
    case FeatureConstants.ENCOURAGEUPDATE:
      if (overrideVersion) {
        await AsyncStorage.setItem(APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL, overrideVersion)
      } else {
        await AsyncStorage.removeItem(APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL)
      }
      break
  }
}

/**
 *
 * returns local version for particular feature, version name for iOS and buildnumber for Android.
 * This is due to how the app store returns the version vs the google play store api
 */
export const getLocalVersion = async (feature: number, demoMode: boolean): Promise<string> => {
  const whatsNewOverride = await AsyncStorage.getItem(APP_VERSION_WHATS_NEW_LOCAL_OVERRIDE_VAL)
  const encourageUpdateOverride = await AsyncStorage.getItem(APP_VERSION_ENCOURAGE_UPDATE_LOCAL_OVERRIDE_VAL)
  switch (feature) {
    case FeatureConstants.WHATSNEW:
      if (demoMode && whatsNewOverride) {
        return whatsNewOverride
      } else {
        const version = await getVersionName()
        return version
          .replace(/[^0-9.]/g, '')
          .replace(/[.]$/, '')
          .slice(0, -2)
      }
    case FeatureConstants.ENCOURAGEUPDATE:
      if (demoMode && encourageUpdateOverride) {
        return encourageUpdateOverride
      } else if (isIOS()) {
        const version = await getVersionName()
        return version
          .replace(/[^0-9.]/g, '')
          .replace(/[.]$/, '')
          .slice(0, -2)
      } else {
        const version = await getBuildNumber()
        return version.toString()
      }
  }

  return '0.0'
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
    return parsedString[0].slice(0, -2)
  } else {
    return result.toString()
  }
}
