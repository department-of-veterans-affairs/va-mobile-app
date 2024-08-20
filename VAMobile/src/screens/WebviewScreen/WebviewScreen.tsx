import React, { MutableRefObject, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StatusBar, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, BoxProps, LoadingComponent } from 'components'
import { BackButton } from 'components/BackButton'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import * as api from 'store/api'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

import WebviewControlButton from './WebviewControlButton'
import WebviewControls, { WebviewControlsProps } from './WebviewControls'
import WebviewTitle from './WebviewTitle'

const { AUTH_SIS_TOKEN_EXCHANGE_URL } = getEnv()

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
        icon={'Redo'}
        fill={colors.icon.webviewReload}
        testID={t('refresh')}
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

type Cookies = {
  [key: string]: string
}

/**
 * Screen for displaying web content within the app. Provides basic navigation and controls
 */
function WebviewScreen({ navigation, route }: WebviewScreenProps) {
  const theme = useTheme()
  const webviewRef = useRef() as MutableRefObject<WebView>

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [headers, setHeaders] = useState<Cookies>()

  const { url, displayTitle, loadingMessage, useSSO } = route.params

  const onReloadPressed = (): void => {
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

        const cookieHeaders = response.headers.get('Set-Cookie')
        const cookiesObj = cookieHeaders?.split(';').reduce((cookies: Cookies, cookie) => {
          const [key, value] = cookie.split('=')
          cookies[key.trim()] = value ? value.trim() : ''
          return cookies
        }, {})

        setHeaders(cookiesObj)
      } catch (error) {
        logNonFatalErrorToFirebase(error, `Error fetching SSO cookies: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    useSSO && fetchSSOCookies()
  }, [])

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

  return useSSO && loading ? (
    <WebviewLoading loadingMessage={loadingMessage} />
  ) : (
    <Box {...mainViewBoxProps} {...testIdProps('Webview-page', true)}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <WebView
        startInLoadingState
        renderLoading={(): ReactElement => <WebviewLoading loadingMessage={loadingMessage} />}
        source={{ uri: url, headers }}
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
