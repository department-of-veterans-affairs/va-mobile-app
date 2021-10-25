import { AccessibilityRole } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView } from './index'
import { VAAlertBoxColors, VABorderColors } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export type AlertBoxProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** color of the background */
  background: keyof VAAlertBoxColors
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
const AlertBox: FC<AlertBoxProps> = ({ border, background, children, title, text, textA11yLabel, titleA11yLabel, titleRole }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    backgroundColor: background,
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
    py: theme.dimensions.alertPaddingY,
    px: theme.dimensions.alertPaddingX,
  }

  const titleAccessibilityRole = titleRole ? titleRole : text || children ? 'header' : undefined

  return (
    <Box {...boxProps}>
      {title && (
        <Box {...testIdProps(titleA11yLabel || title)} accessibilityRole={titleAccessibilityRole} accessible={true}>
          <TextView variant="MobileBodyBold" mb={text ? theme.dimensions.standardMarginBetween : 0}>
            {title}
          </TextView>
        </Box>
      )}
      {text && (
        <Box accessible={true}>
          <TextView {...testIdProps(textA11yLabel || text)} variant="MobileBody">
            {text}
          </TextView>
        </Box>
      )}
      {children}
    </Box>
  )
}

export default AlertBox
