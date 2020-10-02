import { ActivityIndicator, Button, Modal, StyleProp, Text, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import React, { FC, ReactElement } from 'react'

import { AUTH_STORAGE_TYPE, LOGIN_PROMPT_TYPE } from 'store/types'
import { AuthState, StoreState } from 'store'
import { IS_IOS, testIdProps } from 'utils/accessibility'
import { cancelWebLogin, selectAuthStorageLevel, startBiometricsLogin, startWebLogin } from 'store/actions/auth'
import { useDispatch, useSelector } from 'react-redux'

const LoginScreen: FC = () => {
	const dispatch = useDispatch()
	const { loading /*error*/, loginPromptType, webLoginUrl, selectStorageTypeOptions } = useSelector<StoreState, AuthState>((s) => s.auth)
	// TODO handle error

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	const webviewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		position: 'absolute',
		paddingTop: IS_IOS ? 50 : 0,
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

	const onSelectBioSecurity = (): void => {
		dispatch(selectAuthStorageLevel(AUTH_STORAGE_TYPE.BIOMETRIC))
	}

	const onSelectNoSecurity = (): void => {
		dispatch(selectAuthStorageLevel(AUTH_STORAGE_TYPE.NONE))
	}

	const onLoginUnlock = (): void => {
		dispatch(startBiometricsLogin())
	}

	let loginButton
	if (loginPromptType === LOGIN_PROMPT_TYPE.UNLOCK) {
		loginButton = <Button disabled={loading} title={'Click me to unlock'} {...testIdProps('Login-unlock-button')} onPress={onLoginUnlock} />
	} else {
		loginButton = <Button disabled={loading} title={'Click me to log in'} {...testIdProps('Login-button')} onPress={onLoginInit} />
	}

	let content
	if (webLoginUrl) {
		content = (
			<View style={webviewStyle}>
				<Button title={'Cancel Login'} {...testIdProps('Login-button')} onPress={onCancelWebLogin} />
				<WebView startInLoadingState renderLoading={(): ReactElement => <ActivityIndicator size="large" />} source={{ uri: webLoginUrl }} {...testIdProps('Login-web', true)} />
			</View>
		)
	} else {
		content = (
			<>
				<Text>Login Screen</Text>
				{!loading && loginButton}
				{loading && <ActivityIndicator animating={true} color="#00FF00" size="large" />}
			</>
		)
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Login-screen', true)}>
			<Modal animationType="slide" visible={!!selectStorageTypeOptions?.shown} {...testIdProps('Login-select-save-type-modal')}>
				<View>
					<Button title={'Use Biometrics'} {...testIdProps('Login-selectSecurity-bio')} onPress={onSelectBioSecurity} />
					<Button title={'No security'} {...testIdProps('Login-selectSecurity-none')} onPress={onSelectNoSecurity} />
				</View>
			</Modal>
			{content}
		</View>
	)
}

export default LoginScreen
