import { NativeModules } from 'react-native'

import { isIOS } from 'utils/platform'
import { useTheme } from 'utils/hooks'
const nativeUIUtilities = NativeModules.RNNativeUIUtilities

/**
 * Function changes the bottom navigation bar color when called
 * @returns promise<void>
 */

export const changeNavigationBarColor = async (color = String, animated = true): Promise<void> => {
  if (!isIOS()) {
    const theme = useTheme()
    await nativeUIUtilities.changeNavigationBarColor(color, theme.mode ? true : false, animated)
  }
}
