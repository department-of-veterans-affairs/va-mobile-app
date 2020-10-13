import { AccessibilityProperties, Switch as RNSwitch } from 'react-native'
import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'

export type SwitchProps = AccessibilityProperties & {
	onPress: (value:boolean) => void
	on?: boolean
}

const Switch: FC<SwitchProps> = (props) => {
	const { onPress, on } = props
	const theme = useTheme()
	return (
		<RNSwitch
			trackColor={{ false: theme.colors.control.switchOffTrack, true: theme.colors.control.switchOnTrack }}
			thumbColor={on ? theme.colors.control.switchOnThumb : theme.colors.control.switchOffThumb}
			onValueChange={onPress}
			value={!!on}
		/>
	)
}

export default Switch
