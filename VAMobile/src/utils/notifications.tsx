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
