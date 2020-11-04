import React, { FC } from 'react'

import { Box, BoxProps } from './index'
import { VABackgroundColors, VABorderColors } from 'styles/theme'
import { useTheme } from 'utils/hooks'

export type AlertBoxProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** color of the background */
  background: keyof VABackgroundColors
}

/**
 * Displays content in a box styled as an alert
 */
const AlertBox: FC<AlertBoxProps> = ({ border, background, children }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    backgroundColor: background,
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
    mx: theme.dimensions.gutter,
    py: theme.dimensions.alertPaddingY,
    px: theme.dimensions.alertPaddingX,
  }

  return <Box {...boxProps}>{children}</Box>
}

export default AlertBox
