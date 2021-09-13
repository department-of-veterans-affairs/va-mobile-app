import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, VA_ICON_MAP } from 'components'
import { VAIcon } from 'components'
import { VAIconColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
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
  icon: keyof typeof VA_ICON_MAP
  /** optional width, defaults to 16 */
  width?: number
  /** optional height, defaults to 16 */
  height?: number
  fill?: keyof VAIconColors | string
  /** optional test ID for the button */
  testID?: string
  /** optional accessibility hint for the button */
  a11yHint?: string
}

/**
 * Button used on the Webview screen to interact with webview controls such as forward, back, open or refresh
 */
const WebviewControlButton: FC<ControlButtonProps> = ({ icon, onPress, disabled, width = 16, height = 16, fill, testID, a11yHint }) => {
  const theme = useTheme()

  fill = fill || theme.colors.icon.active

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
    p: (theme.dimensions.webviewButtona11ySize - width) / 2,
  }

  return (
    <TouchableOpacity {...touchableOpacityProps} {...testIdProps(testID || '')} {...a11yHintProp(a11yHint || '')}>
      <Box {...controlBoxProps} style={disabled ? disabledButtonStyle : null}>
        <VAIcon name={icon} width={width} height={height} fill={fill} preventScaling={true} />
      </Box>
    </TouchableOpacity>
  )
}

export default WebviewControlButton
