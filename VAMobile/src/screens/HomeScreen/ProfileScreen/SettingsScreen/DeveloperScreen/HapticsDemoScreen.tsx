import React, { FC } from 'react'
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { HomeStackParamList } from '../../../HomeStackScreens'
import { StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type HapticsDemoScreenProps = StackScreenProps<HomeStackParamList, 'HapticsDemoScreen'>

const HapticsDemoScreen: FC<HapticsDemoScreenProps> = () => {
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  const triggerHaptic = (impact: HapticFeedbackTypes) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    }

    ReactNativeHapticFeedback.trigger(impact, options)
  }

  const hapticButton = (impact: HapticFeedbackTypes, display: string) => {
    return (
      <TextView
        key={impact}
        mt={30}
        variant="MobileBody"
        onPress={() => {
          triggerHaptic(impact)
        }}>
        {display}
      </TextView>
    )
  }

  const hapticOptions = [
    ['impactLight', 'Light'],
    ['impactMedium', 'Medium'],
    ['impactHeavy', 'Heavy'],
    ['rigid', 'Rigid'],
    ['soft', 'Soft'],
    ['notificationSuccess', 'Notification Success'],
    ['notificationWarning', 'Notification Warning'],
    ['notificationError', 'Notification Error'],
  ]

  const multiPlatformButtons = hapticOptions.map((o) => {
    return hapticButton(o[0] as HapticFeedbackTypes, o[1])
  })

  const iOSOptions = [['selection', 'Selection']]

  const iOSButtons = iOSOptions.map((o) => {
    return hapticButton(o[0] as HapticFeedbackTypes, o[1])
  })

  const androidOptions = [
    ['clockTick', 'Clock Tick'],
    ['contextClick', 'Context Click'],
    ['keyboardPress', 'Keyboard Press'],
    ['keyboardRelease', 'Keyboard Release'],
    ['keyboardTap', 'Keyboard Tap'],
    ['longPress', 'Long Press'],
    ['textHandleMove', 'Text Handle Move'],
    ['virtualKey', 'Virtual Key'],
    ['virtualKeyRelease', 'Virtual Key Release'],
    ['effectClick', 'Click Effect'],
    ['effectDoubleClick', 'Double Click Effect'],
    ['effectHeavyClick', 'Heavy Click Effect'],
    ['effectTick', 'Tick Effect'],
  ]

  const androidButtons = androidOptions.map((o) => {
    return hapticButton(o[0] as HapticFeedbackTypes, o[1])
  })

  return (
    <VAScrollView {...testIdProps('Haptics-demo')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            iOS and Android
          </TextView>
          <Box mt={standardMarginBetween}>{multiPlatformButtons}</Box>
        </TextArea>
        <Box mt={20} />
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            iOS only
          </TextView>
          <Box mt={standardMarginBetween}>{iOSButtons}</Box>
        </TextArea>
        <Box mt={20} />
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Android Only
          </TextView>
          <Box mt={standardMarginBetween}>{androidButtons}</Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default HapticsDemoScreen
