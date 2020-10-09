import { ActivityIndicator, Linking, StyleProp, View, ViewStyle } from 'react-native'
import { useDispatch } from 'react-redux'

import { HomeStackParamList } from '../HomeScreen/HomeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { ViewFlexRowSpaceBetween } from 'styles/common'
import { WebView } from 'react-native-webview'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store'
import React, { FC, MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import theme from 'styles/theme'

import { BackButton, BackButtonProps } from 'components/BackButton'
import { useFontScale } from 'utils/common'
import BackArrow from 'images/webview/chevron-left-solid.svg'
import ForwardArrow from 'images/webview/chevron-right-solid.svg'
import OpenBrowser from 'images/webview/external-link-alt-solid.svg'

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

const backForwardWrapperStyle: StyleProp<ViewStyle> = {
	display: 'flex',
	flexDirection: 'row',
}

const headerSafeAreaStyles: StyleProp<ViewStyle> = {
	backgroundColor: theme.activeBlue,
	height: 64,
	position: 'relative',
}

const headerWrapperStyle: StyleProp<ViewStyle> = {
	display: 'flex',
	flexDirection: 'row',
	backgroundColor: 'green',
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
}

const backButtonContainerStyle: StyleProp<ViewStyle> = {
	backgroundColor: 'red',
	flex: 1,
}

type WebviewScreenHeaderProps = {
	goBack: () => void
}

const WebviewScreenHeader: FC<WebviewScreenHeaderProps> = ({ goBack }) => {
	const backButtonProps: BackButtonProps = {
		onPress: goBack,
		canGoBack: true,
		displayText: 'done',
	}

	return (
		<SafeAreaView style={headerSafeAreaStyles} edges={['top']}>
			<View style={headerWrapperStyle}>
				<View style={backButtonContainerStyle}>
					<BackButton {...backButtonProps} />
				</View>
			</View>
		</SafeAreaView>
	)
}

type ControlButtonProps = {
	children: React.ReactNode
	onPress: () => void
	disabled: boolean
}

const ControlButton: FC<ControlButtonProps> = ({ children, onPress, disabled }) => {
	return (
		<StyledControl style={disabled ? disabledButtonStyle : null} onPress={onPress} disabled={disabled}>
			{children}
		</StyledControl>
	)
}

type WebviewControlsProps = {
	onBackPressed: () => void
	onForwardPressed: () => void
	onOpenPressed: () => void
	canGoBack: boolean
	canGoForward: boolean
}

const WebviewControls: FC<WebviewControlsProps> = (props) => {
	const fs = useFontScale()

	return (
		<SafeAreaView edges={['bottom']}>
			<View style={controlsViewStyle}>
				<View style={backForwardWrapperStyle}>
					<ControlButton onPress={props.onBackPressed} disabled={!props.canGoBack}>
						<BackArrow width={fs(15)} height={fs(25)} />
					</ControlButton>
					<ControlButton onPress={props.onForwardPressed} disabled={!props.canGoForward}>
						<ForwardArrow width={fs(15)} height={fs(25)} />
					</ControlButton>
				</View>
				<ControlButton onPress={props.onOpenPressed} disabled={false}>
					<OpenBrowser width={fs(25)} height={fs(25)} />
				</ControlButton>
			</View>
		</SafeAreaView>
	)
}

const WebviewScreen: FC<WebviewScreenProps> = ({ navigation }) => {
	const dispatch = useDispatch()
	const webviewRef = useRef() as MutableRefObject<WebView>

	const [canGoBack, setCanGoBack] = useState(false)
	const [canGoForward, setCanGoForward] = useState(false)
	const [currentUrl, setCurrentUrl] = useState('')

	useEffect(() => {
		dispatch(updateTabBarVisible(false))
	})

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

	const controlProps: WebviewControlsProps = {
		onBackPressed: backPressed,
		onForwardPressed: forwardPressed,
		onOpenPressed: openPressed,
		canGoBack: canGoBack,
		canGoForward: canGoForward,
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Webview-screen', true)}>
			<WebviewScreenHeader goBack={navigation.goBack} />
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
			<WebviewControls {...controlProps} />
		</View>
	)
}

export default WebviewScreen
