import { ActivityIndicator, Button, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { IS_IOS, testIdProps } from 'utils/accessibility'
import { NAMESPACE } from 'constants/namespaces'
import { StyledSourceRegularText } from 'styles/common'
import { WebView } from 'react-native-webview'
import React, { FC, ReactElement } from 'react'

const WebviewScreen: FC<IWebviewScreen> = () => {
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

	return (
		<View style={mainViewStyle} {...testIdProps('Webview-screen', true)}>
			<View style={webviewStyle}>
				<WebView startInLoadingState renderLoading={(): ReactElement => <ActivityIndicator size="large" />} source={{ uri: '' }} {...testIdProps('Webview-web', true)} />
			</View>
		</View>
	)
}

export default WebviewScreen
