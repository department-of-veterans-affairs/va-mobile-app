import { TouchableOpacity } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, TextViewProps } from './index'
import { VABackgroundColors, VATextColors } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
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
}

/**
 * Large button filling the width of the container
 */
const VAButton: FC<VAButtonProps> = ({ onPress, label, textColor, backgroundColor, testID = 'VAButton' }) => {
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

  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
      <TouchableOpacity onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessible={true}>
        <Box {...boxProps}>
          <TextView {...textViewProps}>{label}</TextView>
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

export default VAButton
