import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack'

import store from 'store'
import { fullPanelCardStyleInterpolator } from 'utils/common'
import { isIOS } from 'utils/platform'

export const FULLSCREEN_SUBTASK_OPTIONS: StackNavigationOptions = {
  ...(isIOS() ? TransitionPresets.ModalSlideFromBottomIOS : TransitionPresets.BottomSheetAndroid),
  headerShown: false,
}

export const FEATURE_LANDING_TEMPLATE_OPTIONS: StackNavigationOptions = {
  headerShown: false,
}

export const LARGE_PANEL_OPTIONS: StackNavigationOptions = {
  headerShown: false,
  presentation: 'transparentModal',
  cardOverlayEnabled: true,
  headerStatusBarHeight: 0,
  // Hardcode card style for VoiceOver to prevent a race condition that causes announcements to fail when using interpolator
  ...(isIOS() && store.getState().accessibility.isVoiceOverTalkBackRunning
    ? {
        ...TransitionPresets.ModalSlideFromBottomIOS,
        cardStyle: {
          borderRadius: 0,
          paddingTop: '30%',
          backgroundColor: '#0000004D', // Black with 30% opacity
        },
      }
    : { cardStyle: { borderRadius: 0 }, cardStyleInterpolator: fullPanelCardStyleInterpolator }),
}
