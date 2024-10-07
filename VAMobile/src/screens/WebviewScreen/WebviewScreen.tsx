import React, { MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StatusBar, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

import CookieManager from '@react-native-cookies/cookies'
import { StackScreenProps } from '@react-navigation/stack'

import { Box, BoxProps, LoadingComponent } from 'components'
import { BackButton } from 'components/BackButton'
import { Events } from 'constants/analytics'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import * as api from 'store/api'
import { loadDeviceSecret } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'

import WebviewControlButton from './WebviewControlButton'
import WebviewControls, { WebviewControlsProps } from './WebviewControls'
import WebviewTitle from './WebviewTitle'

const { AUTH_SIS_TOKEN_EXCHANGE_URL } = getEnv()
const SSO_COOKIE_NAMES = ['vagov_access_token', 'vagov_anti_csrf_token', 'vagov_info_token']

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
  const [loading, setLoading] = useState(isSSOSession)
  const [webviewLoadFailed, setWebviewLoadFailed] = useState(false)

  const onReloadPressed = (): void => {
    // Set loading `true` to trigger SSO cookies API call if attempting to reload after initial WebView load failed
    if (isSSOSession && webviewLoadFailed) {
      setWebviewLoadFailed(false)
      setLoading(true)
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
          showCarat={false}
        />
      ),
      headerTitle: () => <WebviewTitle title={displayTitle} />,
      headerRight: () => <ReloadButton reloadPressed={onReloadPressed} />,
    })
  })

  useEffect(() => {
    const fetchSSOCookies = async () => {
      try {
        if (!api.getDeviceSecret()) {
          await loadDeviceSecret()
        }

        await CookieManager.clearAll()

        const response = await fetch(AUTH_SIS_TOKEN_EXCHANGE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            subject_token: api.getAccessToken() || '',
            subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
            actor_token: api.getDeviceSecret() || '',
            actor_token_type: 'urn:x-oath:params:oauth:token-type:device-secret',
            client_id: 'vaweb',
          }).toString(),
        })

        const cookieHeaders = response.headers.get('set-cookie')
        cookieHeaders && (await CookieManager.setFromResponse(AUTH_SIS_TOKEN_EXCHANGE_URL, cookieHeaders))

        const cookies = await CookieManager.get(AUTH_SIS_TOKEN_EXCHANGE_URL)
        const cookiesArray = Object.values(cookies)
        const hasSSOCookies = SSO_COOKIE_NAMES.every((cookieName) =>
          cookiesArray.some((cookie) => cookie.name === cookieName),
        )

        logAnalyticsEvent(Events.vama_sso_cookie_received(hasSSOCookies, url))
      } catch (error) {
        logNonFatalErrorToFirebase(error, `Error fetching SSO cookies: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    if (isSSOSession && loading) {
      fetchSSOCookies()
    }
  }, [isSSOSession, loading, url])

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
    localStorage.setItem('hasSession', true);
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

  return loading ? (
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
        onError={() => {
          setWebviewLoadFailed(true)
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
