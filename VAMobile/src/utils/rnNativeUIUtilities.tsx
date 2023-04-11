import { NativeModules } from 'react-native'

import { isIOS } from 'utils/platform'

const nativeUIUtilities = NativeModules.RNNativeUIUtilities

/**
 * Function changes the bottom navigation bar color when called
 * @returns promise<void>
 */

export const changeNavigationBarColor = async (color: string, mode: boolean, animated = true): Promise<void> => {
  if (!isIOS()) {
    await nativeUIUtilities.changeNavigationBarColor(color, mode, animated)
  }
}
