import { Button, View } from 'react-native'
import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { logout } from 'store/actions'
import { testIdProps } from 'utils/accessibility'

const SettingsScreen: FC = () => {
	const dispatch = useDispatch()

	const onLogout = (): void => {
		dispatch(logout())
	}

	return (
		<View {...testIdProps('Settings-screen')}>
			<Button title="Logout" onPress={onLogout} />
		</View>
	)
}

export default SettingsScreen
