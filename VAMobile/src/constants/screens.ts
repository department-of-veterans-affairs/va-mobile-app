import { StackNavigationOptions, TransitionPresets, TransitionSpecs } from '@react-navigation/stack'
import { fullPanelCardStyleInterpolator } from 'utils/common'
import { isIOS } from 'utils/platform'
import store from 'store'
import theme from 'styles/themes/standardTheme'

export const FULLSCREEN_SUBTASK_OPTIONS: StackNavigationOptions = {
  ...(isIOS() ? TransitionPresets.ModalSlideFromBottomIOS : TransitionPresets.BottomSheetAndroid),
  headerShown: false,
}

export const LARGE_PANEL_OPTIONS: StackNavigationOptions = {
  headerShown: false,
  presentation: 'transparentModal',
  cardOverlayEnabled: true,
  headerStatusBarHeight: 0,
  // Manually set styles for screen readers to prevent a race condition that causes announcements to fail, mainly in VoiceOver
  ...(store.getState().accessibility.isVoiceOverTalkBackRunning
    ? {
        ...TransitionPresets.ModalSlideFromBottomIOS,
        cardStyle: { borderRadius: 0, paddingTop: '30%', backgroundColor: theme.colors.background.overlayOpacity },
      }
    : { cardStyle: { borderRadius: 0 }, cardStyleInterpolator: fullPanelCardStyleInterpolator }),
}
