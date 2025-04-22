import React from 'react'
import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { IconMap } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/iconList'

import { Box, BoxProps } from 'components'
import { VAIconColors } from 'styles/theme'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link WebviewControlButton}
 */
type ControlButtonProps = {
  /** Run when the button is pressed */
  onPress: () => void
  /** If true the button cannot be pressed */
  disabled?: boolean | true
  /** Name of VAIcon to use */
  icon: keyof typeof IconMap
  /** optional width */
  width?: number
  /** optional height */
  height?: number
  fill?: keyof VAIconColors | string
  /** optional test ID for the button */
  testID?: string
  /** optional accessibility hint for the button */
  a11yHint?: string
  /** optional accessibility label for the button */
  a11yLabel?: string
}

/**
 * Button used on the Webview screen to interact with webview controls such as forward, back, open or refresh
 */
function WebviewControlButton({
  icon,
  onPress,
  disabled,
  width,
  height,
  fill,
  testID,
  a11yHint,
  a11yLabel,
}: ControlButtonProps) {
  const theme = useTheme()

  fill = fill || theme.colors.icon.active
  width = width || 24
  height = height || 24

  const touchableOpacityProps: TouchableOpacityProps = {
    disabled,
    accessibilityRole: 'button',
    accessible: true,
    onPress,
  }

  const disabledButtonStyle: StyleProp<ViewStyle> = {
    opacity: 0.5,
  }

  const controlBoxProps: BoxProps = {
    p: (44 - width) / 2,
  }

  return (
    // eslint-disable-next-line react-native-a11y/has-accessibility-hint
    <TouchableOpacity
      {...touchableOpacityProps}
      accessibilityLabel={a11yLabel}
      testID={testID}
      {...a11yHintProp(a11yHint || '')}>
      <Box {...controlBoxProps} style={disabled ? disabledButtonStyle : null}>
        <Icon name={icon} width={width} height={height} fill={fill} preventScaling={true} />
      </Box>
    </TouchableOpacity>
  )
}

export default WebviewControlButton
