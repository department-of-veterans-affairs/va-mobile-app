import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, VA_ICON_MAP } from 'components'
import { useTheme } from 'utils/hooks'
import VAIcon from 'components/VAIcon'

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
}

/**
 * Button used on the Webview screen to interact with webview controls such as forward, back, open or refresh
 */
const WebviewControlButton: FC<ControlButtonProps> = ({ icon, onPress, disabled, width = 25, height = 25 }) => {
	const theme = useTheme()
	const disabledButtonStyle: StyleProp<ViewStyle> = {
		opacity: 0.5,
	}

	const controlBoxProps: BoxProps = {
		p: 8,
	}

	return (
		<TouchableOpacity disabled={disabled} accessibilityRole="button" accessible={true} onPress={onPress}>
			<Box {...controlBoxProps} style={disabled ? disabledButtonStyle : null}>
				<VAIcon name={icon} width={width} height={height} fill={theme.colors.icon.active} />
			</Box>
		</TouchableOpacity>
	)
}

export default WebviewControlButton
