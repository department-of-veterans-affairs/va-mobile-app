import { Box, BoxProps } from 'components'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import React, { FC } from 'react'

/**
 *  Signifies the props that need to be passed in to {@link WebviewControlButton}
 */
type ControlButtonProps = {
	/** Display component the button will wrap */
	children: React.ReactNode
	/** Run when the button is pressed */
	onPress: () => void
	/** If true the button cannot be pressed */
	disabled?: boolean | true
}

/**
 * Button used on the Webview screen to interact with webview controls such as forward, back, open or refresh
 */
const WebviewControlButton: FC<ControlButtonProps> = ({ children, onPress, disabled }) => {
	const disabledButtonStyle: StyleProp<ViewStyle> = {
		opacity: 0.5,
	}

	const controlBoxProps: BoxProps = {
		p: 8,
	}

	return (
		<TouchableOpacity disabled={disabled} accessibilityRole="button" accessible={true} onPress={onPress}>
			<Box {...controlBoxProps} style={disabled ? disabledButtonStyle : null}>
				{children}
			</Box>
		</TouchableOpacity>
	)
}

export default WebviewControlButton
