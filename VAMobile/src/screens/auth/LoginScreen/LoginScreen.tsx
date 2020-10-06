import { ActivityIndicator, Button, StyleProp, Text, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { AuthState, StoreState } from 'store'
import { cancelWebLogin, startWebLogin } from 'store/actions/auth'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'

const LoginScreen: FC = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const { loading /*error*/, webLoginUrl } = useSelector<StoreState, AuthState>((s) => s.auth)
	// TODO handle error

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	const webviewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		position: 'absolute',
		paddingTop: isIOS() ? 50 : 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	}

	const onLoginInit = (): void => {
		dispatch(startWebLogin())
	}
	const onCancelWebLogin = (): void => {
		dispatch(cancelWebLogin())
	}

	const showWebLogin = !!webLoginUrl

	let content
	if (showWebLogin) {
		content = (
			<View style={webviewStyle}>
				<Button title={t('login.cancel')} {...testIdProps('Login-button')} onPress={onCancelWebLogin} />
				<WebView
					startInLoadingState
					renderLoading={(): ReactElement => <ActivityIndicator size="large" />}
					source={{ uri: webLoginUrl || '' }}
					{...testIdProps('Login-web', true)}
				/>
			</View>
		)
	} else {
		content = (
			<>
				<Text> {t('login.screenText')} </Text>
				{!loading && <Button disabled={loading} title={t('login')} {...testIdProps('Login-button')} onPress={onLoginInit} />}
				{loading && <ActivityIndicator animating={true} color="#00FF00" size="large" />}
			</>
		)
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Login-screen', true)}>
			{content}
		</View>
	)
}

export default LoginScreen
