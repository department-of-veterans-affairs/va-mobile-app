import { TouchableOpacity } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, TextViewProps } from './index'
import { VABackgroundColors, VATextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

/**
 * Props for the {@link VAButton}
 */
export type VAButtonProps = {
  /** function called when button is pressed */
  onPress: () => void
  /** text appearing in the button */
  label: string
  /** a string value used to set the buttons testID/accessibility label */
  testID?: string
  /** color of the text */
  textColor: keyof VATextColors
  /** color of the background of the button */
  backgroundColor: keyof VABackgroundColors
  /** text to use as the accessibility hint */
  a11yHint?: string
}

/**
 * Large button filling the width of the container
 */
const VAButton: FC<VAButtonProps> = ({ onPress, label, textColor, backgroundColor, a11yHint, testID = 'VAButton' }) => {
  const theme = useTheme()

  const textViewProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: textColor,
  }

  const boxProps: BoxProps = {
    borderRadius: 5,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
  }

  const hintProps = a11yHint ? a11yHintProp(a11yHint) : {}

  return (
    <Box my={theme.dimensions.marginBetween}>
      <TouchableOpacity onPress={onPress} {...testIdProps(testID)} {...hintProps} accessibilityRole="button" accessible={true}>
        <Box {...boxProps}>
          <TextView {...textViewProps}>{label}</TextView>
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

export default VAButton
