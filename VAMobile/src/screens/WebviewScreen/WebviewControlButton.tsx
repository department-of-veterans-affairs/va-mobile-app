import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, VA_ICON_MAP } from 'components'
import { VAIcon } from 'components'
import { VAIconColors } from 'styles/theme'
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
	/** optional width, defaults to 25 */
	width?: number
	/** optional height, defaults to 25 */
	height?: number
	/** color for the icon, defaults to active */
	fill?: keyof VAIconColors | string
}

/**
 * Button used on the Webview screen to interact with webview controls such as forward, back, open or refresh
 */
const WebviewControlButton: FC<ControlButtonProps> = ({ icon, onPress, disabled, width = 25, height = 25, fill }) => {
	const theme = useTheme()

	fill = fill || theme.colors.icon.active

	const disabledButtonStyle: StyleProp<ViewStyle> = {
		opacity: 0.5,
	}

	const controlBoxProps: BoxProps = {
		p: 10,
	}

	return (
		<TouchableOpacity disabled={disabled} accessibilityRole="button" accessible={true} onPress={onPress}>
			<Box {...controlBoxProps} style={disabled ? disabledButtonStyle : null}>
				<VAIcon name={icon} width={width} height={height} fill={fill} />
			</Box>
		</TouchableOpacity>
	)
}

export default WebviewControlButton
