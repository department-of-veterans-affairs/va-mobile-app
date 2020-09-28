import { ActivityIndicator, Button, StyleProp, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import React, { FC, ReactElement } from 'react'

import { AuthState, StoreState } from 'store'
import { cancelWebLogin, startWebLogin } from 'store/actions/auth'
import { useDispatch, useSelector } from 'react-redux'

import { IS_IOS, testIdProps } from 'utils/accessibility'
import { StyledSourceRegularText } from 'styles/common'

/*type LoginScreenParamList = {
	Login: any
}*/

//type LoginScreenProps = StackScreenProps<LoginScreenParamList, 'Login'>

//type LoginScreenProps = {}

const LoginScreen: FC = () => {
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
				<StyledSourceRegularText>Login Screen</StyledSourceRegularText>
				{!loading && <Button disabled={loading} title={'Click me to log in'} {...testIdProps('Login-button')} onPress={onLoginInit} />}
				{loading && <ActivityIndicator size="large" />}
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
