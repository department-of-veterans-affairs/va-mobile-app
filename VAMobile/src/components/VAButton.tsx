import { AccessibilityState, Pressable } from 'react-native'
import React, { FC, useState } from 'react'

import { Box, BoxProps, TextView, TextViewProps } from './index'
import { VAButtonBackgroundColors, VAButtonTextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export type VAButtonBackgroundColorsVariant = keyof VAButtonBackgroundColors

export const ButtonTypesConstants: {
  buttonPrimary: ButtonTypes
  buttonSecondary: ButtonTypes
} = {
  buttonPrimary: 'buttonPrimary',
  buttonSecondary: 'buttonSecondary',
}
type ButtonTypes = 'buttonPrimary' | 'buttonSecondary'

/**
 * Props for the {@link VAButton}
 */
export type VAButtonProps = {
  /** function called when button is pressed */
  onPress: () => void
  /** text appearing in the button */
  label: string
  /** specifies how the button will look - buttonPrimary has non white background, buttonSecondary has white background w/ colored border  */
  buttonType: ButtonTypes
  /** a string value used to set the buttons testID/accessibility label */
  testID?: string
  /** text to use as the accessibility hint */
  a11yHint?: string
  /** optional prop that disables the button when set to true */
  disabled?: boolean
  /** hides the border if set to true */
  hideBorder?: boolean
  /** optional accessibility state */
  accessibilityState?: AccessibilityState
}

/**
 * Large button filling the width of the container
 */
const VAButton: FC<VAButtonProps> = ({ onPress, label, disabled, buttonType, hideBorder, a11yHint, testID, accessibilityState }) => {
  const theme = useTheme()

  const textViewProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: (disabled ? 'buttonDisabled' : buttonType) as keyof VAButtonTextColors,
  }

  const [isPressed, setIsPressed] = useState(false)

  const _onPressIn = (): void => {
    setIsPressed(true)
  }

  const _onPressOut = (): void => {
    setIsPressed(false)
  }

  const getBorderOrBackgroundColor = (): VAButtonBackgroundColorsVariant => {
    if (disabled) {
      return 'buttonDisabled'
    }

    // animate 'buttonPrimary' when active
    if (isPressed) {
      if (buttonType === 'buttonPrimary') {
        return 'buttonPrimaryActive'
      } else {
        return 'buttonSecondaryActive'
      }
    }

    return buttonType
  }

  const hideButtonBorder = hideBorder || buttonType === ButtonTypesConstants.buttonPrimary || disabled

  const boxProps: BoxProps = {
    borderRadius: 5,
    backgroundColor: getBorderOrBackgroundColor(),
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    borderWidth: hideButtonBorder ? undefined : theme.dimensions.buttonBorderWidth,
    borderColor: hideButtonBorder ? undefined : getBorderOrBackgroundColor(),
  }

  const hintProps = a11yHint ? a11yHintProp(a11yHint) : {}

  return (
    <Pressable
      onPress={onPress}
      onPressIn={_onPressIn}
      onPressOut={_onPressOut}
      disabled={disabled}
      {...testIdProps(testID || label)}
      {...hintProps}
      accessibilityRole="button"
      accessible={true}
      accessibilityState={accessibilityState || {}}>
      <Box {...boxProps}>
        <TextView {...textViewProps}>{label}</TextView>
      </Box>
    </Pressable>
  )
}

export default VAButton
