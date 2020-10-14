import { ActivityIndicator, Button, StyleProp, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store'
import { startBiometricsLogin } from 'store/actions/auth'

import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'

const UnlockScreen: FC = () => {
	const { t } = useTranslation(NAMESPACE.LOGIN)
	const dispatch = useDispatch()

	const { loading } = useSelector<StoreState, AuthState>((s) => s.auth)

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	const onLoginUnlock = (): void => {
		dispatch(startBiometricsLogin())
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Unlock-screen', true)}>
			<Button disabled={loading} title={t('clickToUnlock')} {...testIdProps('Unlock-button')} onPress={onLoginUnlock} />
			{loading && <ActivityIndicator animating={true} color="#00FF00" size="large" />}
		</View>
	)
}

export default UnlockScreen
