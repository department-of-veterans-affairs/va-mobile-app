import { Pressable, PressableProps } from 'react-native'
import React, { FC, useState } from 'react'

import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant, BorderColorVariant, BorderStyles, BorderWidths, BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'
import VAIcon, { VAIconProps, VA_ICON_MAP } from './VAIcon'

type ButtonWithIconProps = {
  /** function to call on press */
  onPress: () => void
  /** text to show on the button */
  buttonText: string
  /** name of the icon to show on the left side */
  iconName: keyof typeof VA_ICON_MAP
  /**VATextColors color for the button text */
  buttonTextColor?: keyof VATextColors
  /**string for accessibility hint */
  a11yHint?: string
  /**  changes the left icon color */
  iconColor?: keyof VAIconColors
  /** changes the right arrow icon color*/
  chevronColor?: keyof VAIconColors
  /** changes the border width */
  borderWidth?: BorderWidths
  /**BackgroundVariant color for background */
  backgroundColor?: BackgroundVariant
  /**BackgroundVariant color for active state */
  backgroundColorActive?: BackgroundVariant
  /**BorderColorVariant color for the borders*/
  borderColor?: BorderColorVariant
  /**BorderColorVariant color for active state for the borders*/
  borderColorActive?: BorderColorVariant
  /**BorderStyles denotes the styling of the borders*/
  borderStyle?: BorderStyles
}

/** common button with icons component */
const ButtonWithIcon: FC<ButtonWithIconProps> = ({
  onPress,
  a11yHint,
  buttonText,
  iconName,
  iconColor,
  chevronColor,
  borderColorActive,
  backgroundColorActive,
  backgroundColor,
  borderColor,
  borderStyle,
  borderWidth,
  buttonTextColor,
}) => {
  const theme = useTheme()
  const [buttonPressed, setButtonPressed] = useState(false)

  const onPressIn = (): void => {
    setButtonPressed(true)
  }
  const onPressOut = (): void => {
    setButtonPressed(false)
  }

  const getBorderColor = (): BorderColorVariant | undefined => {
    if (buttonPressed) {
      return borderColorActive || (theme.colors.border.primaryDarkest as BorderColorVariant)
    }
    return borderColor || (theme.colors.border.secondary as BorderColorVariant)
  }

  const getBackgroundColor = (): BackgroundVariant => {
    if (buttonPressed && backgroundColorActive) {
      return backgroundColorActive
    }

    return backgroundColor ? backgroundColor : 'textBox'
  }

  const presableProps: PressableProps = {
    style: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    onPress,
    accessible: true,
    accessibilityRole: 'button',
    onPressIn,
    onPressOut,
  }

  const boxProps: BoxProps = {
    mx: theme.dimensions.gutter,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: getBackgroundColor(),
    p: 16,
    borderRadius: 6,
    borderWidth: borderWidth || theme.dimensions.buttonBorderWidth,
    borderColor: getBorderColor(),
    borderStyle: borderStyle || 'solid',
  }

  const leftIconProps: VAIconProps = {
    name: iconName,
    fill: iconColor || 'buttonWithIcon',
    height: 24,
    width: 24,
  }

  const rightIconProps: VAIconProps = {
    name: 'ArrowRight',
    fill: chevronColor || 'largeNav',
    height: 16,
    width: 16,
  }

  const buttonTextProps: TextViewProps = {
    color: buttonTextColor || 'bodyText',
    variant: 'MobileBody',
    flex: 1,
    mx: 10,
  }

  return (
    <Pressable {...presableProps} {...a11yHintProp(a11yHint || '')}>
      <Box {...boxProps}>
        <VAIcon {...leftIconProps} />
        <TextView {...buttonTextProps}>{buttonText}</TextView>
        <VAIcon {...rightIconProps} />
      </Box>
    </Pressable>
  )
}

export default ButtonWithIcon
