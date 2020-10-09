import { ActivityIndicator, GestureResponderEvent, Linking, StyleProp, View, ViewStyle } from 'react-native'
import { useDispatch } from 'react-redux'

import { HomeStackParamList } from '../HomeScreen/HomeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from '../../styles/common'
import { WebView } from 'react-native-webview'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store'
import React, { FC, MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import theme from 'styles/theme'

type WebviewScreenProps = StackScreenProps<HomeStackParamList, 'CoronaFAQ'>

const controlsViewStyle: StyleProp<ViewStyle> = {
	display: 'flex',
	flexDirection: 'row',
	alignContent: 'center',
	justifyContent: 'space-between',
	height: 50,
	paddingLeft: 20,
	paddingRight: 20,
	backgroundColor: theme.background,
}

const mainViewStyle: StyleProp<ViewStyle> = {
	flex: 1,
	position: 'absolute',
	paddingTop: 0,
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
}

const disabledButtonStyle: StyleProp<ViewStyle> = {
	opacity: 0.5,
}

const StyledControl = styled(ViewFlexRowSpaceBetween)`
	min-width: 44px;
	padding: 8px;
	height: 44px;
`

type ControlButtonProps = {
	displayText: string
	onPress: () => void
	disabled: boolean
}

const ControlButton: FC<ControlButtonProps> = ({ displayText, onPress, disabled }) => {
	console.debug(displayText + ' ' + disabled)
	return (
		<StyledControl style={disabled ? disabledButtonStyle : null} onPress={onPress} disabled={disabled}>
			<StyledSourceRegularText>{displayText}</StyledSourceRegularText>
		</StyledControl>
	)
}

const WebviewScreen: FC<WebviewScreenProps> = ({ navigation }) => {
	const dispatch = useDispatch()
	const webviewRef = useRef() as MutableRefObject<WebView>

	useEffect(() => {
		dispatch(updateTabBarVisible(false))
	})

	const [canGoBack, setCanGoBack] = useState(false)
	const [canGoForward, setCanGoForward] = useState(false)
	const [currentUrl, setCurrentUrl] = useState('')

	const backPressed = () => {
		webviewRef?.current.goBack()
	}

	const forwardPressed = () => {
		webviewRef?.current.goForward()
	}

	const openPressed = () => {
		Linking.canOpenURL(currentUrl).then((supported) => {
			if (supported) {
				Linking.openURL(currentUrl)
			}
		})
	}

	const onReloadPressed = () => {
		webviewRef?.current.reload()
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Webview-screen', true)}>
			<WebView
				startInLoadingState
				renderLoading={(): ReactElement => <ActivityIndicator size="large" />}
				source={{ uri: 'http://www.google.com' }}
				ref={webviewRef}
				onNavigationStateChange={(navState) => {
					setCanGoBack(navState.canGoBack)
					setCanGoForward(navState.canGoForward)
					setCurrentUrl(navState.url)
				}}
				{...testIdProps('Webview-web', true)}
			/>
			<SafeAreaView edges={['bottom']}>
				<View style={controlsViewStyle}>
					<ControlButton onPress={backPressed} disabled={!canGoBack} displayText={'Back'} />
					<ControlButton onPress={forwardPressed} disabled={!canGoForward} displayText={'Forward'} />
					<ControlButton onPress={openPressed} disabled={false} displayText={'Open'} />
				</View>
			</SafeAreaView>
		</View>
	)
}

export default WebviewScreen
