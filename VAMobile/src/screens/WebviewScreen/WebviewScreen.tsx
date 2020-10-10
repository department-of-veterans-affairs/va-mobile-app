import { ActivityIndicator, Linking, StyleProp, View, ViewStyle } from 'react-native'
import { useDispatch } from 'react-redux'

import { HomeStackParamList } from '../HomeScreen/HomeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { ViewFlexRowSpaceBetween } from 'styles/common'
import { WebView } from 'react-native-webview'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store'
import React, { FC, MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import theme from 'styles/theme'

import { BackButton } from 'components/BackButton'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack/lib/typescript/src/types'
import { isIOS } from 'utils/platform'
import VAIcon from 'components/VAIcon'

const StyledControl = styled(ViewFlexRowSpaceBetween)`
	min-width: 44px;
	padding: 8px;
	min-height: 44px;
`

type ControlButtonProps = {
	children: React.ReactNode
	onPress: () => void
	disabled: boolean
}

const ControlButton: FC<ControlButtonProps> = ({ children, onPress, disabled }) => {
	const disabledButtonStyle: StyleProp<ViewStyle> = {
		opacity: 0.5,
	}

	return (
		<StyledControl style={disabled ? disabledButtonStyle : null} onPress={onPress} disabled={disabled} accessibilityRole="button" accessible={true}>
			{children}
		</StyledControl>
	)
}

const controlsViewStyle: StyleProp<ViewStyle> = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	height: 50,
	paddingLeft: 20,
	paddingRight: 20,
	backgroundColor: theme.background,
}

const backForwardWrapperStyle: StyleProp<ViewStyle> = {
	display: 'flex',
	flexDirection: 'row',
}

type WebviewControlsProps = {
	onBackPressed: () => void
	onForwardPressed: () => void
	onOpenPressed: () => void
	canGoBack: boolean
	canGoForward: boolean
}

const WebviewControls: FC<WebviewControlsProps> = (props) => {
	return (
		<SafeAreaView edges={['bottom']}>
			<View style={controlsViewStyle} accessibilityRole="toolbar">
				<View style={backForwardWrapperStyle}>
					<ControlButton onPress={props.onBackPressed} disabled={!props.canGoBack}>
						<VAIcon name={'WebviewBack'} width={15} height={25} />
					</ControlButton>
					<ControlButton onPress={props.onForwardPressed} disabled={!props.canGoForward}>
						<VAIcon name={'WebviewForward'} width={15} height={25} />
					</ControlButton>
				</View>
				<ControlButton onPress={props.onOpenPressed} disabled={false}>
					<VAIcon name={'WebviewOpen'} width={25} height={25} />
				</ControlButton>
			</View>
		</SafeAreaView>
	)
}

const StyledReloadView = styled.View`
	height: ${isIOS() ? '64px' : '20px'};
	margin-bottom: 16px;
`

type ReloadButtonProps = {
	reloadPressed: () => void
}

const ReloadButton: FC<ReloadButtonProps> = ({ reloadPressed }) => {
	//TODO: get refresh SVG
	return (
		<StyledReloadView>
			<ControlButton onPress={reloadPressed} disabled={false}>
				<VAIcon name={'WebviewOpen'} width={25} height={25} />
			</ControlButton>
		</StyledReloadView>
	)
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

const activitySpinnerStyle: StyleProp<ViewStyle> = {
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	alignItems: 'center',
	justifyContent: 'center',
}

type WebviewScreenProps = StackScreenProps<HomeStackParamList, 'CoronaFAQ'>

const WebviewScreen: FC<WebviewScreenProps> = ({ navigation, route }) => {
	const dispatch = useDispatch()
	const webviewRef = useRef() as MutableRefObject<WebView>

	const [canGoBack, setCanGoBack] = useState(false)
	const [canGoForward, setCanGoForward] = useState(false)
	const [currentUrl, setCurrentUrl] = useState('')

	const { url, displayTitle } = route.params

	const onReloadPressed = () => {
		webviewRef?.current.reload()
	}

	useEffect(() => {
		dispatch(updateTabBarVisible(false))

		navigation.setOptions({
			headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} displayText={'done'} showCarat={false} />,
			// TODO: get lock icon for title
			title: displayTitle,
			headerRight: () => <ReloadButton reloadPressed={onReloadPressed} />,
		})
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

	const INJECTED_JAVASCRIPT = `(function() {
    document.getElementsByClassName("header")[0].style.display='none';
  	document.getElementsByClassName("va-nav-breadcrumbs")[0].style.display='none';
  	document.getElementsByClassName("footer")[0].style.display='none';
	})();`

	const controlProps: WebviewControlsProps = {
		onBackPressed: backPressed,
		onForwardPressed: forwardPressed,
		onOpenPressed: openPressed,
		canGoBack: canGoBack,
		canGoForward: canGoForward,
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Webview-screen', true)}>
			<WebView
				startInLoadingState
				renderLoading={(): ReactElement => <ActivityIndicator style={activitySpinnerStyle} size="large" />}
				source={{ uri: url }}
				injectedJavaScript={INJECTED_JAVASCRIPT}
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
