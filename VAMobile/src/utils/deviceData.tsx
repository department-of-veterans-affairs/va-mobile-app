import { NativeModules } from 'react-native'
import { isIOS } from './platform'

// DeviceData bridge from iOS and Android
const DD = NativeModules.DeviceData

/**
 * returns the custom name of the device set by the user.
 */
export const deviceName = isIOS() ? DD.deviceName : DD.getDeviceName()
