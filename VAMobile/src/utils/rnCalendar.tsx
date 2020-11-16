import { NativeModules } from 'react-native'
import { isIOS } from './platform'

// DeviceData bridge from iOS and Android
const RNCal = NativeModules.RNCalendar

/**
 * returns the custom name of the device set by the user.
 */
export const addToCalendar = async (title: string, beginTime: number, endTime: number, location: string): Promise<void> => {
  if (isIOS()) {
    // do ios once its built
    await RNCal.addToCalendar(title, beginTime, endTime, location)
  } else {
    // add to android
    await RNCal.addToCalendar(title, beginTime, endTime, location)
  }
}
