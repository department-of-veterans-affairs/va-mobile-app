import { StyleProp, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect } from 'react'

import { AuthParamsLoadingStateTypeConstants } from 'store/api/types/auth'
import { AuthState, cancelWebLogin, handleTokenCallbackUrl, sendLoginFailedAnalytics, sendLoginStartAnalytics, setPKCEParams } from 'store/slices/authSlice'
import { Box, HeaderBanner, HeaderBannerProps, LoadingComponent } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { WebviewStackParams } from '../../WebviewScreen/WebviewScreen'
import { featureEnabled } from 'utils/remoteConfig'
import { isErrorObject } from 'utils/common'
import { isIOS } from 'utils/platform'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { startIosAuthSession } from 'utils/rnAuthSesson'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch } from 'utils/hooks'
import getEnv from 'utils/env'
import qs from 'querystringify'

type WebviewLoginProps = StackScreenProps<WebviewStackParams, 'Webview'>
const WebviewLogin: FC<WebviewLoginProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { AUTH_IAM_CLIENT_ID, AUTH_IAM_REDIRECT_URL, AUTH_IAM_SCOPES, AUTH_IAM_ENDPOINT, AUTH_SIS_ENDPOINT } = getEnv()
  const { codeChallenge, authorizeStateParam, authParamsLoadingState } = useSelector<RootState, AuthState>((state) => state.auth)
  const { t } = useTranslation(NAMESPACE.COMMON)

  const SIS_ENABLED = featureEnabled('SIS')

  const params = qs.stringify({
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    ...(SIS_ENABLED
      ? {
          application: 'vamobile',
          oauth: 'true',
        }
      : {
          client_id: AUTH_IAM_CLIENT_ID,
          redirect_uri: AUTH_IAM_REDIRECT_URL,
          scope: AUTH_IAM_SCOPES,
          response_type: 'code',
          response_mode: 'query',
          state: authorizeStateParam,
        }),
  })
  const webLoginUrl = `${SIS_ENABLED ? AUTH_SIS_ENDPOINT : AUTH_IAM_ENDPOINT}?${params}`
  const webviewStyle: StyleProp<ViewStyle> = {
    flex: 1,
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
        if (isErrorObject(e)) {
          if (e.code === '000') {
            dispatch(cancelWebLogin())
            navigation.goBack()
          } else {
            logNonFatalErrorToFirebase(e, 'iOS Login Error')
            dispatch(sendLoginFailedAnalytics(e))
          }
        }
      }
    }
    dispatch(sendLoginStartAnalytics())
    if (authParamsLoadingState === AuthParamsLoadingStateTypeConstants.READY && isIOS()) {
      iosAuth()
    }
  }, [authParamsLoadingState, codeChallenge, authorizeStateParam, dispatch, navigation])

  const loadingSpinner: ReactElement = (
    <Box display="flex" height="100%" width="100%">
      <LoadingComponent text={t('webview.preLogin.message')} />
    </Box>
  )

  // if the OS is iOS, we return the empty screen because the OS will slide the ASWebAuthenticationSession view over the screen
  if (isIOS()) {
    return <></>
  } else if (authParamsLoadingState !== AuthParamsLoadingStateTypeConstants.READY) {
    return <LoadingComponent text={t('webview.preLogin.message')} />
  } else {
    const headerProps: HeaderBannerProps = { leftButton: { text: t('cancel'), onPress: navigation.goBack }, title: { type: 'Static', title: t('signin') } }
    return (
      <>
        <HeaderBanner {...headerProps} />
        <Box style={webviewStyle}>
          <WebView
            source={{ uri: webLoginUrl }}
            incognito={true}
            startInLoadingState
            onError={(e) => {
              const err = new Error(e.nativeEvent.description)
              err.stack = JSON.stringify(e.nativeEvent)
              err.name = e.nativeEvent.title
              logNonFatalErrorToFirebase(err, 'Android Login Webview Error')
              dispatch(sendLoginFailedAnalytics(err))
            }}
            renderLoading={(): ReactElement => loadingSpinner}
            {...testIdProps('Sign-in: Webview-login', true)}
          />
        </Box>
      </>
    )
  }
}

export default WebviewLogin
