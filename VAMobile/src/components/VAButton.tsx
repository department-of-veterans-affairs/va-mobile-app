import { TouchableOpacity } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, TextViewProps } from './index'
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
}

/**
 * Large button filling the width of the container
 */
const VAButton: FC<VAButtonProps> = ({ onPress, label, testID = 'VAButton' }) => {
  const theme = useTheme()

  const textViewProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: 'primaryContrast',
  }

  const boxProps: BoxProps = {
    pt: theme.dimensions.buttonPaddingTop,
    pb: theme.dimensions.buttonPaddingBottom,
    borderRadius: 8,
    backgroundColor: 'button',
    alignItems: 'center',
  }

  return (
    <TouchableOpacity onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessible={true}>
      <Box {...boxProps}>
        <TextView {...textViewProps}>{label}</TextView>
      </Box>
    </TouchableOpacity>
  )
}

export default VAButton
