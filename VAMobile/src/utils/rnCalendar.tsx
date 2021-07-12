import { NativeModules, PermissionsAndroid } from 'react-native'
import { isIOS } from './platform'

// Calendar bridge from iOS and Android
const RNCal = NativeModules.RNCalendar

/**
 * This function adds requests the device add a date to the native calendar and display it to the user.
 * @param title - The title or name of the event to add to the calendar.
 * @param beginTime - The number of seconds UTC from 1970 when the event will start.
 * @param endTime - The number of seconds UTC from 1970 when the event will end.
 * @param location - The address or name of place where the event will take place.
 * @returns Returns an empty Promise
 */
export const addToCalendar = async (title: string, beginTime: number, endTime: number, location: string): Promise<void> => {
  await RNCal.addToCalendar(title, beginTime, endTime, location)
}

/**
 * This function is used to check and see if the app has permission to add to the calendar before sending a request
 * to add an event to the calendar. This should be called every time before addToCalendar.
 * @returns Returns a Promise with a boolan value that indicates whether or not the permission is currently granted.
 */
export const checkCalendarPermission = async (): Promise<boolean> => {
  if (isIOS()) {
    return await RNCal.hasPermission()
  } else {
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR)
  }
}

/**
 * This function is used to request permission from the user to add or edit events in the calendar.
 * This should only be called if checkCalendarPermissions returns a false value.
 * @returns Returns a Promise with a boolean value that indicates whether or not the permission was granted.
 */
export const requestCalendarPermission = async (): Promise<boolean> => {
  if (isIOS()) {
    return await RNCal.requestPermission()
  } else {
    // RN has android built in so we just use this instead of Native Modules
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR, {
        title: 'Calendar Permission Needed for this Action',
        message: 'VA:Health and Benefits needs calendar permission to add your appointments to your calendar',
        buttonNegative: 'Deny',
        buttonPositive: 'Grant',
      })
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        // todo: if this is "never_ask_again" we need to prompt to go to settings?
        return false
      }
    } catch (err) {
      console.warn(err)
      return false
    }
  }
}
