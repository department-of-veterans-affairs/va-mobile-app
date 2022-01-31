import DeviceInfo from 'react-native-device-info'

/**
 * returns the version name string for the app
 */
export const versionName: string = DeviceInfo.getVersion()

/**
 * returns the current build number of the app
 */
export const buildNumber: string = DeviceInfo.getBuildNumber()
