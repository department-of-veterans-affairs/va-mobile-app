import { ActivityIndicator, Linking, StyleProp, ViewStyle } from 'react-native'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { WebView } from 'react-native-webview'
import React, { FC, MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'

import { BackButton } from 'components/BackButton'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { Box, BoxProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import WebviewControlButton from './WebviewControlButton'
import WebviewControls, { WebviewControlsProps } from './WebviewControls'
import WebviewTitle from './WebviewTitle'

type ReloadButtonProps = {
  reloadPressed: () => void
}

const ReloadButton: FC<ReloadButtonProps> = ({ reloadPressed }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { dimensions, colors } = theme

  const reloadBoxProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    mr: dimensions.textIconMargin,
    height: dimensions.webviewReloadButtonHeight,
  }

  return (
    <Box {...reloadBoxProps}>
      <WebviewControlButton onPress={reloadPressed} disabled={false} icon={'WebviewRefresh'} fill={colors.icon.contrast} testID={t('refresh')} a11yHint={t('refresh.a11yHint')} />
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
  const webviewRef = useRef() as MutableRefObject<WebView>

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  const { url, displayTitle } = route.params

  const onReloadPressed = (): void => {
    webviewRef?.current.reload()
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.done} showCarat={false} />
      ),
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
    <Box {...mainViewBoxProps} {...testIdProps('Webview-page', true)}>
      <WebView
        startInLoadingState
        renderLoading={(): ReactElement => <WebviewLoading />}
        source={{ uri: url }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        ref={webviewRef}
        // onMessage is required to be present for injected javascript to work on iOS
        onMessage={(): void => {
          // no op
        }}
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
