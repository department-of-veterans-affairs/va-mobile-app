import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'

export const triggerHaptic = (impact: HapticFeedbackTypes) => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  }

  ReactNativeHapticFeedback.trigger(impact, options)
}
