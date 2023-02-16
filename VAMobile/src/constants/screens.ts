import { Platform } from 'react-native'
import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack'

export const FULLSCREEN_SUBTASK_OPTIONS: StackNavigationOptions = {
  presentation: 'modal',
  ...(Platform.OS === 'ios' ? TransitionPresets.ModalSlideFromBottomIOS : TransitionPresets.BottomSheetAndroid),
  headerShown: false,
}
