import { NativeModules } from 'react-native'
import { isIOS } from './platform'

// DeviceData bridge from iOS and Android
const DD = NativeModules.DeviceData

/**
 * returns the custom name of the device set by the user.
 */
export const deviceName: string = isIOS() ? DD.deviceName : DD.getDeviceName()

/**
 * returns the version name string for the app
 */
export const versionName: string = isIOS() ? DD.versionName : DD.getVersionName()

/**
 * returns the current build number of the app
 */
export const buildNumber: number = isIOS() ? DD.buildNumber : DD.getBuildNumber()
