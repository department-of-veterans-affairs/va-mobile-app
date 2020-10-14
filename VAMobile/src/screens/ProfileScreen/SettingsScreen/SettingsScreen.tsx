import { Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'
import _ from 'underscore'

import { AuthState, StoreState } from 'store'
import { Box, ButtonDecoratorType, ButtonList, ButtonListItemObj } from 'components'
import { logout, setShouldSaveAuthWithBiometrics } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const SettingsScreen: FC = () => {
	const dispatch = useDispatch()
	const t = useTranslation('settings')
	const theme = useTheme()
	const { canStoreWithBiometric, shouldStoreWithBiometric } = useSelector<StoreState, AuthState>((s) => s.auth)
	const onLogout = (): void => {
		dispatch(logout())
	}

	const onNoop = (): void => {
		//noop TODO implement features
	}

	const onToggleTouchId = (): void => {
		dispatch(setShouldSaveAuthWithBiometrics(!shouldStoreWithBiometric))
	}

	const touchIdRow: ButtonListItemObj = {
		textIDs: 'touchId.title',
		a11yHintID: 'touchId.a11yHint',
		onPress: onToggleTouchId,
		decorator: ButtonDecoratorType.Switch,
		decoratorProps: { on: shouldStoreWithBiometric },
	}

	const items: Array<ButtonListItemObj> = _.flatten([
		{ textIDs: 'manageAccount.title', a11yHintID: 'manageAccount.a11yHint', onPress: onNoop },
		// don't even show the biometrics option if it's not available
		canStoreWithBiometric ? touchIdRow : [],
		{ textIDs: 'shareApp.title', a11yHintID: 'shareApp.a11yHint', onPress: onNoop },
		{ textIDs: 'privacyPolicy.title', a11yHintID: 'privacyPolicy.a11yHint', onPress: onNoop },
	])

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
