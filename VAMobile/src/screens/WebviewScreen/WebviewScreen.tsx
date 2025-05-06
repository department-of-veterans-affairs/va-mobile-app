import React, { MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StatusBar, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, BoxProps, LoadingComponent } from 'components'
import { BackButton } from 'components/BackButton'
import { Events } from 'constants/analytics'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { fetchSSOCookies } from 'utils/auth'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'

import WebviewControlButton from './WebviewControlButton'
import WebviewControls, { WebviewControlsProps } from './WebviewControls'
import WebviewTitle from './WebviewTitle'

type ReloadButtonProps = {
  reloadPressed: () => void
}

function ReloadButton({ reloadPressed }: ReloadButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { dimensions, colors } = theme

  const reloadBoxProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    mr: dimensions.textIconMargin,
    height: isIOS() ? 64 : 45, // this is done due to position difference between IOS and Android
  }

  return (
    <Box {...reloadBoxProps}>
      <WebviewControlButton
        onPress={reloadPressed}
        disabled={false}
        icon={'Refresh'}
        fill={colors.icon.webviewReload}
        testID={t('refresh')}
        a11yLabel={t('refresh')}
      />
    </Box>
  )
}

type WebviewLoadingProps = {
  loadingMessage?: string
}

function WebviewLoading({ loadingMessage }: WebviewLoadingProps) {
  const spinnerStyle: ViewStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }

  const loadingMessageA11y = loadingMessage ? a11yLabelVA(loadingMessage) : undefined

  return (
    <Box style={spinnerStyle}>
      <LoadingComponent text={loadingMessage} a11yLabel={loadingMessageA11y} />
    </Box>
  )
}

export type WebviewStackParams = {
  Webview: {
    /** Url to display in the webview */
    url: string
    /** Text to appear with a lock icon in the header */
    displayTitle: string
    /** Text to appear with a lock icon in the header */
    loadingMessage?: string
    /** Use SSO to authenticate webview */
    useSSO?: boolean
  }
}

type WebviewScreenProps = StackScreenProps<WebviewStackParams, 'Webview'>

/**
 * Screen for displaying web content within the app. Provides basic navigation and controls
 */
function WebviewScreen({ navigation, route }: WebviewScreenProps) {
  const { url, displayTitle, loadingMessage, useSSO } = route.params
  const isSSOSession = featureEnabled('sso') && useSSO

  const theme = useTheme()
  const webviewRef = useRef() as MutableRefObject<WebView>

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [fetchingSSOCookies, setFetchingSSOCookies] = useState(isSSOSession)
  const [webviewLoadFailed, setWebviewLoadFailed] = useState(false)

  const onReloadPressed = (): void => {
    // Fetch SSO cookies when attempting to reload after initial WebView load failed
    if (isSSOSession && webviewLoadFailed) {
      setWebviewLoadFailed(false)
      setFetchingSSOCookies(true)
    }
    webviewRef?.current.reload()
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          webview={true}
          onPress={props.onPress}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.done}
        />
      ),
      headerTitle: () => <WebviewTitle title={displayTitle} />,
      headerRight: () => <ReloadButton reloadPressed={onReloadPressed} />,
    })
  })

  useEffect(() => {
    if (fetchingSSOCookies) {
      fetchSSOCookies().finally(() => setFetchingSSOCookies(false))
    }
  }, [fetchingSSOCookies])

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

  // The following two consts are an effort to reduce the 'noise' of the websites we are linking to
  // via webview and make them a more specific path for the user to experience. This code ignores headers,
  // footers, breadcrumbs, intercept feedback screens, mobile specific navigation, and the feedback button.
  const css = `
  header, footer, va-breadcrumbs, .mobile-nav, #mdFormButton, #MDigitalInvitationWrapper { display: none; }
  nav[aria-label="My HealtheVet"] { display: none; }
`

  const INJECTED_JAVASCRIPT = `(function() {
  localStorage.setItem('hasSession', true);
  const styleElement = document.createElement('style');
  styleElement.innerHTML = \`${css}\`;
  document.head.appendChild(styleElement);
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

  return fetchingSSOCookies ? (
    <WebviewLoading loadingMessage={loadingMessage} />
  ) : (
    <Box {...mainViewBoxProps} testID="Webview-page">
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <WebView
        startInLoadingState
        renderLoading={(): ReactElement => <WebviewLoading loadingMessage={loadingMessage} />}
        source={{ uri: url }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        sharedCookiesEnabled={true}
        ref={webviewRef}
        // onMessage is required to be present for injected javascript to work on iOS
        onMessage={(): void => {
          // no op
        }}
        onError={(syntheticEvent) => {
          setWebviewLoadFailed(true)
          const { nativeEvent } = syntheticEvent
          nativeEvent.url = currentUrl
          logAnalyticsEvent(Events.vama_webview_fail(JSON.stringify(nativeEvent)))
        }}
        onNavigationStateChange={(navState): void => {
          setCanGoBack(navState.canGoBack)
          setCanGoForward(navState.canGoForward)
          setCurrentUrl(navState.url)
        }}
        testID="Webview-web"
      />
      <WebviewControls {...controlProps} />
    </Box>
  )
}

export default WebviewScreen
