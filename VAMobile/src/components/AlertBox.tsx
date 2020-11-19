import React, { FC } from 'react'

import { Box, BoxProps, TextView } from './index'
import { VAAlertBoxColors, VABorderColors } from 'styles/theme'
import { useTheme } from 'utils/hooks'

export type AlertBoxProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** color of the background */
  background: keyof VAAlertBoxColors
  /** body of the alert */
  text: string
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
        <TextView variant="MobileBodyBold" mb={theme.dimensions.marginBetween}>
          {title}
        </TextView>
      )}
      <TextView variant="MobileBody">{text}</TextView>
      {children}
    </Box>
  )
}

export default AlertBox
