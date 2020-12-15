import React, { FC } from 'react'

import _ from 'underscore'

import { Box, BoxProps, TextLine, TextView } from './index'
import { VAAlertBoxColors, VABorderColors } from 'styles/theme'
import { useTheme } from 'utils/hooks'

export type AlertBoxProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** color of the background */
  background: keyof VAAlertBoxColors
  /** body of the alert */
  text?: string | Array<TextLine>
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

  const updatedTextLines = _.isArray(text) ? text : [{ text: text }]

  const textViews = _.map(updatedTextLines, (textLine, index) => {
    const { text, variant, color, onPress } = textLine as TextLine
    return (
      <TextView variant={variant || 'MobileBody'} color={color || 'primary'} onPress={onPress} key={index}>
        {text}
      </TextView>
    )
  })

  return (
    <Box {...boxProps}>
      {title && (
        <TextView variant="MobileBodyBold" mb={text ? theme.dimensions.marginBetween : 0}>
          {title}
        </TextView>
      )}
      <Box display="flex">{textViews}</Box>
      {children}
    </Box>
  )
}

export default AlertBox
