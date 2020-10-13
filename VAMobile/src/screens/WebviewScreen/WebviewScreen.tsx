import { ActivityIndicator, Linking, StyleProp, ViewStyle } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack/lib/typescript/src/types'
import { StackScreenProps } from '@react-navigation/stack'
import { WebView } from 'react-native-webview'
import { useDispatch } from 'react-redux'
import React, { FC, MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'

import { BackButton } from 'components/BackButton'
import { Box, BoxProps, TextView } from 'components'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store'
import { useTheme } from 'utils/hooks'
import VAIcon from 'components/VAIcon'
import WebviewControlButton from './WebviewControlButton'
import WebviewControls, { WebviewControlsProps } from './WebviewControls'

type ReloadButtonProps = {
	reloadPressed: () => void
}

const ReloadButton: FC<ReloadButtonProps> = ({ reloadPressed }) => {
	const theme = useTheme()

	return (
		<Box mb={16} height={isIOS() ? 64 : 20}>
			<WebviewControlButton onPress={reloadPressed} disabled={false}>
				<VAIcon name={'WebviewRefresh'} width={25} height={25} fill={theme.colors.icon.contrast} />
			</WebviewControlButton>
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
			<Box mr={8}>
				<VAIcon name={'Lock'} height={20} width={17} fill={theme.colors.icon.contrast} />
			</Box>
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

export type WebviewStackParams = {
	Webview: {
		/** Url to display in the webview */
		url: string
		/** Text to appear with a lock icon in the header */
		displayTitle: string
	}
}

type WebviewScreenProps = StackScreenProps<WebviewStackParams, 'Webview'>

/**
 * Screen for displaying web content within the app. Provides basic navigation and controls
 */
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
