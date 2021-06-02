import { WebView } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect } from 'react'

import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native'
import { AuthState, StoreState } from 'store/reducers'
import { Box } from 'components'
import { startWebLogin } from 'store/actions'
import { testIdProps } from 'utils/accessibility'

const WebviewLogin: FC = () => {
  const dispatch = useDispatch()
  const { webLoginUrl } = useSelector<StoreState, AuthState>((s) => s.auth)

  useEffect(() => {
    if (!webLoginUrl) {
      dispatch(startWebLogin())
    }
  }, [dispatch, webLoginUrl])

  const webviewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  const loadingSpinner: ReactElement = (
    <Box display="flex" height="100%" width="100%" justifyContent="center" alignItems="center">
      <ActivityIndicator size="large" />
    </Box>
  )

  if (!webLoginUrl) {
    return loadingSpinner
  } else {
    return (
      <Box style={webviewStyle}>
        <WebView
          startInLoadingState
          renderLoading={(): ReactElement => loadingSpinner}
          source={{ uri: webLoginUrl }}
          incognito={true}
          {...testIdProps('Sign-in: Webview-login', true)}
        />
      </Box>
    )
  }
}

export default WebviewLogin
