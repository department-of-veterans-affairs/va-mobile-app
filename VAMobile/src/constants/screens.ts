import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack'
import { fullPanelCardStyleInterpolator } from 'utils/common'
import { isIOS } from 'utils/platform'

export const FULLSCREEN_SUBTASK_OPTIONS: StackNavigationOptions = {
  ...(isIOS() ? TransitionPresets.ModalSlideFromBottomIOS : TransitionPresets.BottomSheetAndroid),
  headerShown: false,
}

export const LARGE_PANEL_OPTIONS: StackNavigationOptions = {
  headerShown: false,
  presentation: 'transparentModal',
  cardStyleInterpolator: fullPanelCardStyleInterpolator,
  cardOverlayEnabled: true,
  headerStatusBarHeight: 0,
  cardStyle: {
    borderRadius: 0,
  },
}
