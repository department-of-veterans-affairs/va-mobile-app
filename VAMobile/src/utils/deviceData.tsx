import { NativeModules } from 'react-native'

// DeviceData bridge from iOS and Android
const DD = NativeModules.DeviceData

/**
 * returns the custom name of the device set by the user.
 */
export const getDeviceName = async (): Promise<string> => {
  return await DD.getDeviceName()
}

/**
 * returns the version name string for the app
 */
export const getVersionName = async (): Promise<string> => {
  return await DD.getVersionName()
}

/**
 * returns the current build number of the app
 */
export const getBuildNumber = async (): Promise<number> => {
  return await DD.getBuildNumber()
}
