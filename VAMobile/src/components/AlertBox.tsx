import React, { FC, RefObject, useEffect, useState } from 'react'
import { AccessibilityRole, ScrollView, View } from 'react-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { VABorderColors } from 'styles/theme'
import { triggerHaptic } from 'utils/haptics'
import { useAutoScrollToElement, useTheme } from 'utils/hooks'

import { Box, BoxProps, TextView } from './index'

export type AlertBoxProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** Optional boolean for determining when to focus on error alert boxes (e.g. onSaveClicked). */
  focusOnError?: boolean
  /** Optional ref for the parent scroll view. Used for scrolling to error alert boxes. */
  scrollViewRef?: RefObject<ScrollView>
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
  /** optional testID */
  testId?: string
}

/**
 * Displays content in a box styled as an alert
 */
const AlertBox: FC<AlertBoxProps> = ({
  border,
  children,
  focusOnError = true,
  scrollViewRef,
  title,
  text,
  textA11yLabel,
  titleA11yLabel,
  titleRole,
  testId,
}) => {
  const theme = useTheme()
  const [scrollRef, viewRef, scrollToAlert] = useAutoScrollToElement()
  const [shouldFocus, setShouldFocus] = useState(true)

  const boxPadding = 20

  useEffect(() => {
    if (border === 'error' && scrollViewRef?.current && (title || text)) {
      scrollRef.current = scrollViewRef.current
      scrollToAlert(-boxPadding)
    }
    setShouldFocus(focusOnError)
  }, [border, focusOnError, scrollRef, scrollToAlert, scrollViewRef, text, title])

  const boxProps: BoxProps = {
    backgroundColor: 'alertBox',
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
    py: boxPadding,
    px: boxPadding,
    testID: testId,
  }

  const vibrate = (): void => {
    if (border === 'error') {
      triggerHaptic(HapticFeedbackTypes.notificationError)
    } else if (border === 'warning') {
      triggerHaptic(HapticFeedbackTypes.notificationWarning)
    }
  }

  const titleAccessibilityRole = titleRole ? titleRole : text || children ? 'header' : undefined

  return (
    <Box {...boxProps}>
      {!!title && (
        <View
          ref={viewRef}
          accessible={true}
          accessibilityLabel={titleA11yLabel || title}
          accessibilityRole={titleAccessibilityRole}>
          <TextView variant="MobileBodyBold" mb={text ? theme.dimensions.standardMarginBetween : 0}>
            {title}
          </TextView>
        </View>
      )}
      {!!text && (
        <View ref={!title ? viewRef : undefined} accessible={true} accessibilityLabel={textA11yLabel || text}>
          <TextView variant="MobileBody">{text}</TextView>
        </View>
      )}
      {children}
      {shouldFocus && vibrate()}
    </Box>
  )
}

export default AlertBox
