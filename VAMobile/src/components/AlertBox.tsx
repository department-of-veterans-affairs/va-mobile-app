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
}

/**
 * Displays content in a box styled as an alert
 */
const AlertBox: FC<AlertBoxProps> = ({ border, background, children, title, text }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    backgroundColor: background,
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
    py: theme.dimensions.alertPaddingY,
    px: theme.dimensions.alertPaddingX,
  }

  return (
    <Box {...boxProps}>
      {title && (
        <Box {...testIdProps(title)} accessibilityRole={text ? 'header' : undefined} accessible={true}>
          <TextView variant="MobileBodyBold" mb={text ? theme.dimensions.marginBetween : 0}>
            {title}
          </TextView>
        </Box>
      )}
      {text && (
        <Box {...testIdProps(text)} accessible={true}>
          <TextView variant="MobileBody">{text}</TextView>
        </Box>
      )}
      {children}
    </Box>
  )
}

export default AlertBox
