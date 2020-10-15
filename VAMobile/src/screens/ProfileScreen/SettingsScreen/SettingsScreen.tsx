import { Button, View } from 'react-native'
import { useDispatch } from 'react-redux'
import React, { FC, useState } from 'react'

import { Box, ButtonDecoratorType, ButtonList, ButtonListItemObj } from 'components'
import { logout } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const SettingsScreen: FC = () => {
	const dispatch = useDispatch()
	const t = useTranslation('settings')
	const theme = useTheme()
	const [touchIdEnabled, setTouchIdEnabled] = useState(false)

	const onLogout = (): void => {
		dispatch(logout())
	}

	const onNoop = (): void => {
		//noop TODO implement features
	}

	const onToggleTouchId = (): void => {
		//TODO wire this up for real with a redux action
		setTouchIdEnabled(!touchIdEnabled)
	}

	const items: Array<ButtonListItemObj> = [
		{ textIDs: 'manageAccount.title', a11yHintID: 'manageAccount.a11yHint', onPress: onNoop },
		{
			textIDs: 'touchId.title',
			a11yHintID: 'touchId.a11yHint',
			onPress: onToggleTouchId,
			decorator: ButtonDecoratorType.Switch,
			decoratorProps: { on: touchIdEnabled },
		},
		{ textIDs: 'shareApp.title', a11yHintID: 'shareApp.a11yHint', onPress: onNoop },
		{ textIDs: 'privacyPolicy.title', a11yHintID: 'privacyPolicy.a11yHint', onPress: onNoop },
	]

	return (
		<View {...testIdProps('Settings-screen')}>
			<Box my={32}>
				<ButtonList items={items} translationNameSpace={'settings'} />
			</Box>
			<Button color={theme.colors.text.error} title={t('logout.title')} onPress={onLogout} />
		</View>
	)
}

export default SettingsScreen
