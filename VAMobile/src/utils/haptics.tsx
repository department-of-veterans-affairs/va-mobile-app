import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { featureEnabled } from './remoteConfig'

export const triggerHaptic = (impact: HapticFeedbackTypes) => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  }
  if (featureEnabled('haptics')) {
    ReactNativeHapticFeedback.trigger(impact, options)
  }
}
