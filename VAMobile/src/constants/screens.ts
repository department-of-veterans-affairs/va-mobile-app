import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack'
import { isIOS } from 'utils/platform'

export const FULLSCREEN_SUBTASK_OPTIONS: StackNavigationOptions = {
  ...(isIOS() ? TransitionPresets.ModalSlideFromBottomIOS : TransitionPresets.BottomSheetAndroid),
  headerShown: false,
}
