import { AccessibilityRole, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView } from './index'
import { RootState } from 'store'
import { SettingsState } from 'store/slices'
import { VABorderColors } from 'styles/theme'
import { featureEnabled } from 'utils/remoteConfig'
import { triggerHaptic } from 'utils/haptics'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

export type AlertBoxProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** body of the alert */
  text?: string
  /** optional bolded title text */
  title?: string
  /** optional accessibility label for the text */
  textA11yLabel?: string
  /** optional accessibility label for the title */
  titleA11yLabel?: string
  /** optional accessibility role for the title */
  titleRole?: AccessibilityRole
}

/**
 * Displays content in a box styled as an alert
 */
const AlertBox: FC<AlertBoxProps> = ({ border, children, title, text, textA11yLabel, titleA11yLabel, titleRole }) => {
  const theme = useTheme()
  const [titleFocusRef, setTitleFocus] = useAccessibilityFocus<View>()
  const [textFocusRef, setTextFocus] = useAccessibilityFocus<View>()

  const focusOnAlert = border === 'error' && (title || text)
  useFocusEffect(focusOnAlert && title ? setTitleFocus : setTextFocus)
  const { haptics } = useSelector<RootState, SettingsState>((state) => state.settings)

  const boxProps: BoxProps = {
    backgroundColor: 'alertBox',
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
    py: 20,
    px: 20,
  }
  const vibrate = (): void => {
    if (!featureEnabled('haptics') || !haptics) {
      return
    }
    if (border === 'error') {
      triggerHaptic('notificationError')
    } else if (featureEnabled('haptics') && haptics && border === 'warning') {
      triggerHaptic('notificationWarning')
    }
  }

  const titleAccessibilityRole = titleRole ? titleRole : text || children ? 'header' : undefined

  return (
    <Box {...boxProps}>
      {!!title && (
        <View ref={titleFocusRef} accessible={true} accessibilityLabel={titleA11yLabel || title} accessibilityRole={titleAccessibilityRole}>
          <TextView variant="MobileBodyBold" mb={text ? theme.dimensions.standardMarginBetween : 0}>
            {title}
          </TextView>
        </View>
      )}
      {!!text && (
        <View ref={textFocusRef} accessible={true} accessibilityLabel={textA11yLabel || text}>
          <TextView variant="MobileBody">{text}</TextView>
        </View>
      )}
      {children}
      {vibrate()}
    </Box>
  )
}

export default AlertBox
