import { Pressable } from 'react-native'
import React, { FC, useState } from 'react'

import { BackgroundVariant, BorderColorVariant, Box, BoxProps, TextView, TextViewProps } from './index'
import { VABorderColors, VATextColors } from 'styles/theme'
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
  backgroundColor: BackgroundVariant
  /** optional border color of the button */
  borderColor?: keyof VABorderColors
  /** text to use as the accessibility hint */
  a11yHint?: string
  /** optional prop that disables the button when set to true */
  disabled?: boolean
}

/**
 * Large button filling the width of the container
 */
const VAButton: FC<VAButtonProps> = ({ onPress, label, textColor, backgroundColor, borderColor, disabled, a11yHint, testID = 'VAButton' }) => {
  const theme = useTheme()

  const textViewProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: textColor,
  }

  const [isPressed, setIsPressed] = useState(false)

  const _onPressIn = (): void => {
    setIsPressed(true)
  }

  const _onPressOut = (): void => {
    setIsPressed(false)
  }

  const getBorderColor = (): BorderColorVariant | undefined => {
    // animate 'textBox' w/ 'secondary' when active
    if (isPressed && backgroundColor === 'textBox' && borderColor === 'secondary') {
      return 'primaryDarkest'
    }
    return borderColor
  }

  const getBackgroundColor = (): BackgroundVariant => {
    // animate 'button' when active
    if (isPressed && backgroundColor === 'button') {
      return 'activeButton'
    }

    return !disabled ? backgroundColor : 'disabledButton'
  }

  const boxProps: BoxProps = {
    borderRadius: 5,
    backgroundColor: getBackgroundColor(),
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    borderWidth: borderColor ? theme.dimensions.buttonBorderWidth : undefined,
    borderColor: getBorderColor(),
  }

  const hintProps = a11yHint ? a11yHintProp(a11yHint) : {}

  return (
    <Pressable
      onPress={onPress}
      onPressIn={_onPressIn}
      onPressOut={_onPressOut}
      disabled={disabled}
      {...testIdProps(testID)}
      {...hintProps}
      accessibilityRole="button"
      accessible={true}>
      <Box {...boxProps}>
        <TextView {...textViewProps}>{label}</TextView>
      </Box>
    </Pressable>
  )
}

export default VAButton
