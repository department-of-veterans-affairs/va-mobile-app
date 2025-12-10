import { NativeModules } from 'react-native'
import { Notifications } from 'react-native-notifications'

import { isIOS } from 'utils/platform'

const { RNNotificationPrefs } = NativeModules

export const notificationsEnabled = async (): Promise<boolean> => {
  if (isIOS()) {
    const prefs = await Notifications.ios.checkPermissions()
    return prefs.alert
  } else {
    return await RNNotificationPrefs.notificationsOn()
  }
}

/**
 * Trims the id that follows the main url path
 * @param notificationUrl - url string of the format: vamobile://{path}/{id}
 *
 * ex. 'vamobile://messages/1234' into 'vamobile://messages/'
 */
export const trimNotificationUrl = (notificationUrl: string) => {
  const urlPattern = /vamobile:\/\/([a-z]+)\/(.+)/g
  const replacementTemplate = 'vamobile://$1/'
  return notificationUrl.replace(urlPattern, replacementTemplate)
}
