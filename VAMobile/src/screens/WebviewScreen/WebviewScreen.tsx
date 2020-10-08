import { ActivityIndicator, Button, StyleProp, View, ViewStyle } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { HomeStackParamList } from '../HomeScreen/HomeScreen'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { StyledSourceRegularText } from 'styles/common'
import { WebView } from 'react-native-webview'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store'
import React, { FC, ReactElement, useEffect, useLayoutEffect } from 'react'

type WebviewScreenProps = StackScreenProps<HomeStackParamList, 'CoronaFAQ'>

const WebviewScreen: FC<WebviewScreenProps> = ({ navigation }) => {
	const dispatch = useDispatch()

	useLayoutEffect(() => {
		dispatch(updateTabBarVisible(false))
	})

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		position: 'absolute',
		paddingTop: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	}

	const webviewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		position: 'absolute',
		paddingTop: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Webview-screen', true)}>
			<WebView
				startInLoadingState
				renderLoading={(): ReactElement => <ActivityIndicator size="large" />}
				source={{ uri: 'http://www.google.com' }}
				{...testIdProps('Webview-web', true)}
			/>
		</View>
	)
}

export default WebviewScreen
