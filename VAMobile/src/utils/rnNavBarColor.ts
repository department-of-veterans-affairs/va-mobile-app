import { NativeModules } from 'react-native'
import { isIOS } from './platform'

// Nav Bar Color bridge for Android
const RNNavBarColor = NativeModules.RNNavBarColor

/**
 *This function sends a request to update the color of the nav bar on Android devices.
 * @param color - The color to update the Nav Bar with.
 * @returns Returns an empty Promise
 */
export const updateNavBarColor = async (color: string): Promise<void> => {
  if (!isIOS()) {
    console.log('changing color to ' + color)
    await RNNavBarColor.changeNavigationBarColor(color)
  }
}
