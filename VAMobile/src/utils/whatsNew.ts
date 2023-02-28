import AsyncStorage from '@react-native-async-storage/async-storage'

import { getVersionName } from 'utils/deviceData'

const APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL = '@store_app_whats_new_version_skipped'
const APP_VERSION_LOCAL_OVERRIDE_VAL = '@store_app_version_local_override'
/**
 * returns version skipped for what's new
 */
export const getWhatsNewVersionSkipped = async (): Promise<string> => {
  const reconstructedToken = (await AsyncStorage.getItem(APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL)) || '0.0.0'
  return reconstructedToken
}

export const getWhatsNewLocalVersion = async (demoMode: boolean): Promise<string> => {
  const localOverride = await AsyncStorage.getItem(APP_VERSION_LOCAL_OVERRIDE_VAL)
  if (demoMode && localOverride) {
    return localOverride
  } else {
    return await getVersionName()
  }
}

/**
 * stores version skipped for what's new
 */
export const setWhatsNewVersionSkipped = async (versionSkipped: string): Promise<void> => {
  await AsyncStorage.setItem(APP_VERSION_WHATS_NEW_SKIPPED_UPDATE_VAL, versionSkipped)
}
