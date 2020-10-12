import { ActivityIndicator, Linking, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import { useDispatch } from 'react-redux'

import { BackButton } from 'components/BackButton'
import { Box, BoxProps, TextView } from 'components'
import { HomeStackParamList } from '../HomeScreen/HomeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack/lib/typescript/src/types'
import { StackScreenProps } from '@react-navigation/stack'
import { WebView } from 'react-native-webview'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store'
import { useTheme } from 'utils/hooks'
import React, { FC, MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import VAIcon from 'components/VAIcon'

type ControlButtonProps = {
	children: React.ReactNode
	onPress: () => void
	disabled: boolean
}

const ControlButton: FC<ControlButtonProps> = ({ children, onPress, disabled }) => {
	const disabledButtonStyle: StyleProp<ViewStyle> = {
		opacity: 0.5,
	}

	const controlBoxProps: BoxProps = {
		p: 8,
	}

	return (
		<TouchableOpacity disabled={disabled} accessibilityRole="button" accessible={true} onPress={onPress}>
			<Box {...controlBoxProps} style={disabled ? disabledButtonStyle : null}>
				{children}
			</Box>
		</TouchableOpacity>
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
	const controlsViewProps: BoxProps = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 50,
		pl: 20,
		pr: 20,
	}

	return (
		<SafeAreaView edges={['bottom']}>
			<Box {...controlsViewProps}>
				<Box display="flex" flexDirection="row">
					<ControlButton onPress={props.onBackPressed} disabled={!props.canGoBack}>
						<VAIcon name={'WebviewBack'} width={15} height={25} />
					</ControlButton>
					<ControlButton onPress={props.onForwardPressed} disabled={!props.canGoForward}>
						<VAIcon name={'WebviewForward'} width={15} height={25} />
					</ControlButton>
				</Box>
				<ControlButton onPress={props.onOpenPressed} disabled={false}>
					<VAIcon name={'WebviewOpen'} width={25} height={25} />
				</ControlButton>
			</Box>
		</SafeAreaView>
	)
}

type ReloadButtonProps = {
	reloadPressed: () => void
}

const ReloadButton: FC<ReloadButtonProps> = ({ reloadPressed }) => {
	const theme = useTheme()

	return (
		<Box mb={16} height={isIOS() ? 64 : 20}>
			<ControlButton onPress={reloadPressed} disabled={false}>
				<VAIcon name={'WebviewRefresh'} width={25} height={25} fill={theme.colors.icon.contrast} />
			</ControlButton>
		</Box>
	)
}

type WebviewTitleProps = {
	title: string
}
const WebviewTitle: FC<WebviewTitleProps> = ({ title }) => {
	const theme = useTheme()

	return (
		<Box display={'flex'} flexDirection={'row'}>
			<VAIcon name={'Lock'} height={20} width={17} fill={theme.colors.icon.contrast} />
			<TextView color="primaryContrast">{title}</TextView>
		</Box>
	)
}

const WebviewLoading: FC = ({}) => {
	const activitySpinnerStyle: StyleProp<ViewStyle> = {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return <ActivityIndicator style={activitySpinnerStyle} size="large" />
}

type WebviewScreenProps = StackScreenProps<HomeStackParamList, 'CoronaFAQ'>

const WebviewScreen: FC<WebviewScreenProps> = ({ navigation, route }) => {
	const dispatch = useDispatch()
	const webviewRef = useRef() as MutableRefObject<WebView>

	const [canGoBack, setCanGoBack] = useState(false)
	const [canGoForward, setCanGoForward] = useState(false)
	const [currentUrl, setCurrentUrl] = useState('')

	const { url, displayTitle } = route.params

	const onReloadPressed = (): void => {
		webviewRef?.current.reload()
	}

	useEffect(() => {
		dispatch(updateTabBarVisible(false))

		navigation.setOptions({
			headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} displayText={'done'} showCarat={false} />,
			headerTitle: () => <WebviewTitle title={displayTitle} />,
			headerRight: () => <ReloadButton reloadPressed={onReloadPressed} />,
		})
	})

	const backPressed = (): void => {
		webviewRef?.current.goBack()
	}

	const forwardPressed = (): void => {
		webviewRef?.current.goForward()
	}

	const openPressed = (): void => {
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

	const mainViewBoxProps: BoxProps = {
		flex: 1,
		position: 'absolute',
		pt: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	}

	return (
		<Box {...mainViewBoxProps} {...testIdProps('Webview-screen', true)}>
			<WebView
				startInLoadingState
				renderLoading={(): ReactElement => <WebviewLoading />}
				source={{ uri: url }}
				injectedJavaScript={INJECTED_JAVASCRIPT}
				ref={webviewRef}
				onNavigationStateChange={(navState): void => {
					setCanGoBack(navState.canGoBack)
					setCanGoForward(navState.canGoForward)
					setCurrentUrl(navState.url)
				}}
				{...testIdProps('Webview-web', true)}
			/>
			<WebviewControls {...controlProps} />
		</Box>
	)
}

export default WebviewScreen
