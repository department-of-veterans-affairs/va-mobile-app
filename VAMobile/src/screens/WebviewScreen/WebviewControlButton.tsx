import { Box, BoxProps } from 'components'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import React, { FC } from 'react'

type ControlButtonProps = {
	children: React.ReactNode
	onPress: () => void
	disabled: boolean
}

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
