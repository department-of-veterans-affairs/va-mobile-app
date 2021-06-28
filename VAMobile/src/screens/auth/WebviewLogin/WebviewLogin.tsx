import { WebView } from 'react-native-webview'
import React, { FC, ReactElement, useEffect } from 'react'

import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native'
import { AuthParamsLoadingStateTypeConstants, handleTokenCallbackUrl, setPKCEParams } from 'store'
import { AuthState, StoreState } from 'store/reducers'
import { Box, LoadingComponent } from 'components'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { WebviewStackParams } from '../../WebviewScreen/WebviewScreen'
import { isIOS } from 'utils/platform'
import { startIosAuthSession } from 'utils/rnAuthSesson'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import crashlytics from '@react-native-firebase/crashlytics'
import getEnv from 'utils/env'
import qs from 'querystringify'

type WebviewLoginProps = StackScreenProps<WebviewStackParams, 'Webview'>
const WebviewLogin: FC<WebviewLoginProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const { AUTH_CLIENT_ID, AUTH_REDIRECT_URL, AUTH_SCOPES, AUTH_ENDPOINT } = getEnv()
  const { codeChallenge, authorizeStateParam, authParamsLoadingState } = useSelector<StoreState, AuthState>((s) => s.auth)

  const params = qs.stringify({
    client_id: AUTH_CLIENT_ID,
    redirect_uri: AUTH_REDIRECT_URL,
    scope: AUTH_SCOPES,
    response_type: 'code',
    response_mode: 'query',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: authorizeStateParam,
  })
  const webLoginUrl = `${AUTH_ENDPOINT}?${params}`
  const webviewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  useEffect(() => {
    if (authParamsLoadingState === AuthParamsLoadingStateTypeConstants.INIT) {
      dispatch(setPKCEParams())
    }
  }, [authParamsLoadingState, dispatch])

  useEffect(() => {
    const iosAuth = async () => {
      try {
        const callbackUrl = await startIosAuthSession(codeChallenge || '', authorizeStateParam || '')
        dispatch(handleTokenCallbackUrl(callbackUrl))
      } catch (e) {
        // code "000" comes back from the RCT bridge if the user cancelled the log in, all other errors are code '001'
        if (e.code === '000') {
          navigation.goBack()
        } else {
          crashlytics().recordError(e, 'iOS Login Error')
        }
      }
    }
    if (authParamsLoadingState === AuthParamsLoadingStateTypeConstants.READY && isIOS()) {
      iosAuth()
    }
  }, [authParamsLoadingState, codeChallenge, authorizeStateParam, dispatch, navigation])

  const loadingSpinner: ReactElement = (
    <Box display="flex" height="100%" width="100%" justifyContent="center" alignItems="center">
      <ActivityIndicator size="large" />
    </Box>
  )

  // if the OS is iOS, we return the empty screen because the OS will slide the ASWebAuthenticationSession view over the screen
  if (isIOS()) {
    return <></>
  } else if (authParamsLoadingState !== AuthParamsLoadingStateTypeConstants.READY) {
    return <LoadingComponent />
  } else {
    return (
      <Box style={webviewStyle}>
        <WebView
          source={{ uri: webLoginUrl }}
          incognito={true}
          startInLoadingState
          onError={(e) => {
            const err = new Error(e.nativeEvent.description)
            err.stack = JSON.stringify(e.nativeEvent)
            err.name = e.nativeEvent.title
            crashlytics().recordError(err, 'Android Login Webview Error')
          }}
          renderLoading={(): ReactElement => loadingSpinner}
          {...testIdProps('Sign-in: Webview-login', true)}
        />
      </Box>
    )
  }
}

export default WebviewLogin
