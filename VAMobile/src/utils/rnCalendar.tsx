import { NativeModules, PermissionsAndroid } from 'react-native'
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

// todo: this is android, need ios native call to check this.
export const checkCalendarPermission = async (): Promise<boolean> => {
  if (isIOS()) {
    console.log(RNCal)
    return await RNCal.hasPermission()
  } else {
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR)
  }
}

// todo: this is android, need ios native call to check this.
export const requestCalendarPermission = async (): Promise<boolean> => {
  if (isIOS()) {
    return await RNCal.requestPermission()
  } else {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR, {
        title: 'Calendar Permission Needed for this Action',
        message: 'VA Mobile App needs calendar permission to add your appointments to your calendar',
        buttonNegative: 'Deny',
        buttonPositive: 'Grant',
      })
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        // todo: if this is "never_ask_again" we need to prompt to go to settings.
        return false
      }
    } catch (err) {
      console.warn(err)
      return false
    }
  }
}
