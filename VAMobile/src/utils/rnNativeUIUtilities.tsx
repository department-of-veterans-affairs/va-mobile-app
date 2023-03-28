import { NativeModules } from 'react-native'

import { getTheme } from 'styles/themes/standardTheme'
import { isIOS } from 'utils/platform'

const nativeUIUtilities = NativeModules.RNNativeUIUtilities

/**
 * Function changes the bottom navigation bar color when called
 * @returns promise<void>
 */

export const changeNavigationBarColor = async (color: string, animated = true): Promise<void> => {
  if (!isIOS()) {
    const theme = getTheme()
    await nativeUIUtilities.changeNavigationBarColor(color, theme.mode === 'dark' ? true : false, animated)
  }
}
