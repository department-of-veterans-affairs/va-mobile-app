import { AccessibilityRole, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC, Ref } from 'react'

import { Box, BoxProps, TextView } from './index'
import { VABorderColors } from 'styles/theme'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'

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
  /** optional ref for the alert */
  viewRef?: Ref<View>
}

/**
 * Displays content in a box styled as an alert
 */
const AlertBox: FC<AlertBoxProps> = ({ border, children, title, text, textA11yLabel, titleA11yLabel, titleRole, viewRef }) => {
  const theme = useTheme()
  const [titleFocusRef, setTitleFocus] = useAccessibilityFocus<View>()
  const [textFocusRef, setTextFocus] = useAccessibilityFocus<View>()

  const focusOnAlert = border === 'error' && (title || text)
  // useFocusEffect(focusOnAlert ? (title ? setTitleFocus : setTextFocus) : () => {})

  const boxProps: BoxProps = {
    backgroundColor: 'alertBox',
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
    py: 20,
    px: 20,
  }

  const titleAccessibilityRole = titleRole ? titleRole : text || children ? 'header' : undefined

  return (
    <View ref={viewRef} accessible={true}>
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
      </Box>
    </View>
  )
}

export default AlertBox
